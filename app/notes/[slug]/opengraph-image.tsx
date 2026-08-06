import { renderOgImage, OG_SIZE } from "@/lib/og";
import { getAllNotes, getNoteBySlug } from "@/lib/content/notes";

export const alt = "Note by Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((entry) => ({ slug: entry.frontmatter.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getNoteBySlug(slug);

  return renderOgImage({
    eyebrow: "Arqum Usmani · Notes",
    title: entry ? entry.frontmatter.title : "Note",
  });
}
