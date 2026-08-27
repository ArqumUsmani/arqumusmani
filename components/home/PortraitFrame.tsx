import Image from "next/image";
import { cn } from "@/lib/cn";
// Static import (not a "/about/Side.png" string src) so Next generates a
// blur placeholder and intrinsic dimensions automatically instead of us
// hand-maintaining width/height and shipping no LQIP at all.
import portraitSrc from "@/public/about/SideSmile.png";

type PortraitFrameProps = {
  sizes: string;
  priority?: boolean;
  className?: string;
  /** "hero" (About page) is the larger treatment; "teaser" (home page) is smaller. */
  size?: "hero" | "teaser";
};

// Sized off the smaller of viewport width/height (not a fixed px cap), so it
// scales up on large and 4K displays instead of topping out at a width tuned
// for a laptop screen, while the vh term keeps a short-but-wide viewport
// (e.g. an ultrawide monitor) from stretching the portrait's height too far.
const WIDTH = {
  hero: "clamp(520px, min(22vw, 42vh), 640px)",
  teaser: "clamp(240px, min(16vw, 32vh), 460px)",
} as const;

// The shared portrait treatment for the About hero and its home-page teaser:
// a warm glow behind the subject, and the photo itself masked with a single
// soft radial fade centred on the face. Unlike a rectangular edge-fade, this
// dissolves the photo on every side at once (feathered, not cropped) and
// lets the glow show through the faded area — a mask reveals whatever sits
// behind it, so this works unmodified in both light and dark mode.
//
// The wrapper's width is deliberately wider than its grid column at large
// viewports and left un-clamped by any ancestor's overflow — it's meant to
// bleed rightward into the column's outer margin rather than stay boxed in.
export function PortraitFrame({ sizes, priority, className, size = "hero" }: PortraitFrameProps) {
  return (
    <div className={cn(className)} style={{ width: WIDTH[size] }}>
      <div className="relative overflow-visible">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -inset-y-20 [background:radial-gradient(circle_at_58%_42%,color-mix(in_srgb,var(--color-signal)_32%,transparent),transparent_62%)] blur-2xl"
        />
        <Image
          src={portraitSrc}
          alt="Portrait of Arqum Usmani"
          placeholder="blur"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className="relative h-auto w-full"
          style={{
            maskImage:
              "radial-gradient(ellipse 78% 68% at 38% 32%, black 25%, color-mix(in srgb, black 55%, transparent) 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 68% at 38% 32%, black 25%, color-mix(in srgb, black 55%, transparent) 55%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
