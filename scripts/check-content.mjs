#!/usr/bin/env node
// Fails the build if any content reachable by URL still contains TODO,
// Lorem(-ipsum), or "placeholder" text. Case studies are always reachable
// (no draft flag in the schema); notes are only checked when published:
// true, matching what generateStaticParams actually emits.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const FORBIDDEN = /\b(TODO|Lorem|placeholder)\b/i;

async function checkDir(dir, { onlyPublished }) {
  const files = (await readdir(dir).catch(() => [])).filter((f) => f.endsWith(".mdx"));
  const violations = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = await readFile(filePath, "utf8");

    if (onlyPublished) {
      const isPublished = /^published:\s*true\s*$/m.test(raw);
      if (!isPublished) continue;
    }

    const lines = raw.split("\n");
    lines.forEach((line, i) => {
      const match = FORBIDDEN.exec(line);
      if (match) {
        violations.push(`  ${filePath}:${i + 1} — "${match[0]}" in: ${line.trim().slice(0, 100)}`);
      }
    });
  }

  return violations;
}

const workViolations = await checkDir(path.join(process.cwd(), "content/work"), { onlyPublished: false });
const noteViolations = await checkDir(path.join(process.cwd(), "content/notes"), { onlyPublished: true });

const all = [...workViolations, ...noteViolations];

if (all.length > 0) {
  console.error("\n✖ Build-blocking content check failed.\n");
  console.error("Found TODO / Lorem / placeholder text in published content:\n");
  console.error(all.join("\n"));
  console.error("\nRemove the placeholder text (or unpublish the note) before building.\n");
  process.exit(1);
}

console.log("✓ Content check passed — no TODO/Lorem/placeholder text in published content.");
