import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { getAllNotes } from "@/lib/content/notes";
import { preventOrphans } from "@/lib/typography";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short, opinionated notes on design and engineering from Arqum Usmani.",
  alternates: {
    canonical: "/notes",
  },
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <Reveal inView={false}>
          <MonoLabel as="p" className="mb-6">
            Notes
          </MonoLabel>
          <h1 className="max-w-[16ch] text-display-xl text-ink">{preventOrphans("Short and opinionated.")}</h1>
          <div className="mt-8">
            <ArrowLink href="/notes/rss.xml" variant="mono">
              RSS feed
            </ArrowLink>
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24">
          {notes.map((entry, i) => (
            <Reveal key={entry.frontmatter.slug} index={i}>
              <Link
                href={`/notes/${entry.frontmatter.slug}`}
                className="group block border-t border-mist py-10 last:border-b md:py-14"
              >
                <MonoLabel as="p" className="mb-4 text-ash">
                  {formatDate(entry.frontmatter.date)}
                </MonoLabel>
                <h2 className="max-w-[28ch] text-display-m text-ink transition-colors duration-300 group-hover:text-signal">
                  {preventOrphans(entry.frontmatter.title)}
                </h2>
                <p className="mt-4 max-w-[60ch] text-body-l text-graphite">{entry.frontmatter.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {entry.frontmatter.tags.map((tag) => (
                    <MonoLabel key={tag} className="text-ash">
                      #{tag}
                    </MonoLabel>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
