"use client";

import { useEffect, useRef } from "react";

type Point = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const SPACING = 56; // px between resting points — sparse, not a dense grid
const CURSOR_RADIUS = 140;
const REPEL_STRENGTH = 900;
const SPRING = 0.02;
const DAMPING = 0.9;

// Quiet ambient element for the hero: a sparse field of points that hold a
// resting grid and drift away from the cursor, springing back when it
// moves on. Says nothing about the work (this is decoration, not proof —
// the line above it carries the actual credibility), so it stays out of
// the way: low opacity, monochrome, no shapes competing with the type.
//
// Fully inert under prefers-reduced-motion (one static frame, no cursor
// tracking, no rAF loop) and pauses whenever the tab is hidden or the
// canvas scrolls out of view, so it never burns cycles for nothing.
export function GenerativeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = () => document.documentElement.classList.contains("dark");
    const dotColor = () => (isDark() ? "58, 58, 55" : "201, 201, 196"); // --color-mist
    const accentColor = () => (isDark() ? "217, 114, 47" : "180, 83, 31"); // --color-signal

    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, active: false };

    function layout() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      points = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = offsetX + col * SPACING;
          const baseY = offsetY + row * SPACING;
          points.push({ baseX, baseY, x: baseX, y: baseY, vx: 0, vy: 0 });
        }
      }
    }

    function drawStatic() {
      layout();
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = `rgba(${dotColor()}, 0.4)`;
      for (const p of points) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    if (reduceMotion) {
      drawStatic();
      const ro = new ResizeObserver(drawStatic);
      ro.observe(canvas.parentElement!);
      return () => ro.disconnect();
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onPointerLeave() {
      mouse.active = false;
    }

    let frameId: number;
    let running = true;

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      let nearestIndex = -1;
      let nearestDist = Infinity;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestIndex = i;
          }
          if (dist < CURSOR_RADIUS && dist > 0.01) {
            const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * REPEL_STRENGTH;
            p.vx += (dx / dist) * force * 0.0005;
            p.vy += (dy / dist) * force * 0.0005;
          }
        }

        p.vx += (p.baseX - p.x) * SPRING;
        p.vy += (p.baseY - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      ctx!.fillStyle = `rgba(${dotColor()}, 0.4)`;
      for (let i = 0; i < points.length; i++) {
        if (i === nearestIndex && mouse.active && nearestDist < CURSOR_RADIUS) continue;
        ctx!.beginPath();
        ctx!.arc(points[i].x, points[i].y, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (nearestIndex !== -1 && mouse.active && nearestDist < CURSOR_RADIUS) {
        const p = points[nearestIndex];
        ctx!.fillStyle = `rgba(${accentColor()}, 0.55)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx!.fill();
      }

      frameId = requestAnimationFrame(tick);
    }

    layout();
    frameId = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(canvas.parentElement!);

    function onVisibilityChange() {
      running = document.visibilityState === "visible";
      if (running) frameId = requestAnimationFrame(tick);
      else cancelAnimationFrame(frameId);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && document.visibilityState === "visible";
        if (running) frameId = requestAnimationFrame(tick);
        else cancelAnimationFrame(frameId);
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
