#!/usr/bin/env node
// Fails the build on any dead href="#" link — literal in JSX, or a data
// value (like a social URL in site-config.ts) that would render as one.
// Intentional in-page anchors (e.g. "#main-content") are unaffected: this
// only matches a bare "#" with nothing after it.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_DIRS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx"]);

const HREF_LITERAL = /href\s*=\s*(?:"#"|'#'|\{\s*["']#["']\s*\})/;
const BARE_HASH_VALUE = /:\s*(?:"#"|'#')\s*[,}]/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];

for (const dir of SOURCE_DIRS) {
  const files = await walk(path.join(process.cwd(), dir));
  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const lines = raw.split("\n");
    lines.forEach((line, i) => {
      if (HREF_LITERAL.test(line) || (file.endsWith("site-config.ts") && BARE_HASH_VALUE.test(line))) {
        violations.push(`  ${file}:${i + 1} — ${line.trim().slice(0, 100)}`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error("\n✖ Dead-link check failed.\n");
  console.error('Found href="#" (or a data value that renders as one):\n');
  console.error(violations.join("\n"));
  console.error("\nEither wire in the real URL or remove the link entirely.\n");
  process.exit(1);
}

console.log('✓ Dead-link check passed — no href="#" anywhere.');
