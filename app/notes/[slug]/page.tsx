import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { getAllNotes, getNoteBySlug } from "@/lib/content/notes";
import { preventOrphans } from "@/lib/typography";

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((entry) => ({ slug: entry.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getNoteBySlug(slug);
  if (!entry) return {};

  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.excerpt,
    alternates: {
      canonical: `/notes/${entry.frontmatter.slug}`,
    },
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.excerpt,
      type: "article",
    },
  };
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getNoteBySlug(slug);
  if (!entry) notFound();

  const { frontmatter, content } = entry;

  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <Reveal inView={false}>
          <MonoLabel as="p" className="mb-6">
            {formatDate(frontmatter.date)}
          </MonoLabel>
          <h1 className="max-w-[20ch] text-display-l text-ink">{preventOrphans(frontmatter.title)}</h1>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {frontmatter.tags.map((tag) => (
              <MonoLabel key={tag} className="text-ash">
                #{tag}
              </MonoLabel>
            ))}
          </div>
        </Reveal>

        <article className="mt-16 md:mt-20">{content}</article>
      </Container>
    </Section>
  );
}
