import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { proseComponents } from "@/components/mdx";
import { workFrontmatterSchema, type WorkFrontmatter } from "@/lib/content/schema";

const WORK_DIR = path.join(process.cwd(), "content/work");

export type WorkEntry = {
  frontmatter: WorkFrontmatter;
  content: React.ReactElement;
};

export const getAllWork = cache(async (): Promise<WorkEntry[]> => {
  const files = (await readdir(WORK_DIR)).filter((file) => file.endsWith(".mdx"));

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(WORK_DIR, file), "utf8");

      const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
        source: raw,
        options: { parseFrontmatter: true, blockJS: false },
        components: proseComponents,
      });

      const result = workFrontmatterSchema.safeParse(frontmatter);
      if (!result.success) {
        throw new Error(
          `Invalid frontmatter in content/work/${file}:\n${result.error.issues
            .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
            .join("\n")}`,
        );
      }

      if (result.data.slug !== file.replace(/\.mdx$/, "")) {
        throw new Error(
          `Frontmatter slug "${result.data.slug}" does not match filename content/work/${file}`,
        );
      }

      return { frontmatter: result.data, content };
    }),
  );

  return entries.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
});

export async function getWorkBySlug(slug: string): Promise<WorkEntry | undefined> {
  const all = await getAllWork();
  return all.find((entry) => entry.frontmatter.slug === slug);
}

export async function getAdjacentWork(slug: string): Promise<WorkEntry | undefined> {
  const all = await getAllWork();
  const index = all.findIndex((entry) => entry.frontmatter.slug === slug);
  if (index === -1) return undefined;
  return all[(index + 1) % all.length];
}
