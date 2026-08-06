import { renderOgImage, OG_SIZE } from "@/lib/og";
import { getAllWork, getWorkBySlug } from "@/lib/content/work";

export const alt = "Case study by Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const work = await getAllWork();
  return work.map((entry) => ({ slug: entry.frontmatter.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getWorkBySlug(slug);

  return renderOgImage({
    eyebrow: entry ? `${entry.frontmatter.domain} · ${entry.frontmatter.year}` : "Arqum Usmani",
    title: entry ? entry.frontmatter.title : "Case study",
  });
}
