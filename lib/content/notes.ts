import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { proseComponents } from "@/components/mdx";
import { noteFrontmatterSchema, type NoteFrontmatter } from "@/lib/content/schema";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

export type NoteEntry = {
  frontmatter: NoteFrontmatter;
  content: React.ReactElement;
};

export const getAllNotes = cache(async (): Promise<NoteEntry[]> => {
  const files = (await readdir(NOTES_DIR)).filter((file) => file.endsWith(".mdx"));

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(NOTES_DIR, file), "utf8");

      const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
        source: raw,
        options: { parseFrontmatter: true, blockJS: false },
        components: proseComponents,
      });

      const result = noteFrontmatterSchema.safeParse(frontmatter);
      if (!result.success) {
        throw new Error(
          `Invalid frontmatter in content/notes/${file}:\n${result.error.issues
            .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
            .join("\n")}`,
        );
      }

      if (result.data.slug !== file.replace(/\.mdx$/, "")) {
        throw new Error(
          `Frontmatter slug "${result.data.slug}" does not match filename content/notes/${file}`,
        );
      }

      return { frontmatter: result.data, content };
    }),
  );

  return entries
    .filter((entry) => entry.frontmatter.published)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
});

export async function getNoteBySlug(slug: string): Promise<NoteEntry | undefined> {
  const all = await getAllNotes();
  return all.find((entry) => entry.frontmatter.slug === slug);
}
