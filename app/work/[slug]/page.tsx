import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { MetaBar } from "@/components/work/MetaBar";
import { ConfidentialNotice } from "@/components/work/ConfidentialNotice";
import { ReadingProgress } from "@/components/work/ReadingProgress";
import { ChainedNav } from "@/components/work/ChainedNav";
import { getAllWork, getWorkBySlug, getAdjacentWork } from "@/lib/content/work";
import { preventOrphans } from "@/lib/typography";
import { JsonLd } from "@/components/JsonLd";
import { creativeWorkJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const work = await getAllWork();
  return work.map((entry) => ({ slug: entry.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getWorkBySlug(slug);
  if (!entry) return {};

  const { frontmatter } = entry;
  return {
    title: frontmatter.title,
    description: frontmatter.thesis,
    alternates: {
      canonical: `/work/${frontmatter.slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.thesis,
      type: "article",
    },
  };
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getWorkBySlug(slug);
  if (!entry) notFound();

  const { frontmatter, content } = entry;
  const next = await getAdjacentWork(slug);

  return (
    <>
      <JsonLd data={creativeWorkJsonLd(frontmatter)} />
      <ReadingProgress />

      <Section className="pb-0 pt-16 md:pt-24">
        <Container>
          <Reveal inView={false}>
            <MonoLabel as="p" className="mb-6">
              {frontmatter.domain} · {frontmatter.year}
            </MonoLabel>
          </Reveal>
          {/* Not wrapped in Reveal: gating this h1 behind Motion's own
              opacity fade would cost LCP on a direct visit for no benefit.
              The ViewTransition name is dormant now that the home page's
              card grid (which used to provide the matching source element
              for a shared-element morph) has been removed — harmless to
              leave in place if a card-based entry point returns later. */}
          <ViewTransition name={`work-title-${frontmatter.slug}`}>
            <h1 className="max-w-[22ch] text-display-l text-ink">{preventOrphans(frontmatter.title)}</h1>
          </ViewTransition>
          <Reveal inView={false} index={1}>
            <p className="mt-6 max-w-[60ch] text-body-l text-graphite">{frontmatter.thesis}</p>
          </Reveal>
          {frontmatter.confidential && (
            <Reveal inView={false} index={2} className="mt-8">
              <ConfidentialNotice />
            </Reveal>
          )}
        </Container>

        <div className="mt-12 w-full border-y border-mist bg-fog md:mt-16">
          <ViewTransition name={`work-image-${frontmatter.slug}`}>
            <Image
              src={frontmatter.cover}
              alt={`Cover image for ${frontmatter.title}`}
              width={1920}
              height={1200}
              priority
              sizes="100vw"
              className="h-auto max-h-[70vh] w-full object-cover"
            />
          </ViewTransition>
        </div>
      </Section>

      <MetaBar
        role={frontmatter.role}
        team={frontmatter.team}
        timeline={frontmatter.timeline}
        platform={frontmatter.platform}
        domain={frontmatter.domain}
        year={frontmatter.year}
      />

      {frontmatter.gallery.length > 0 && (
        <Section className="pb-0">
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
              {frontmatter.gallery.map((src, i) => (
                <div key={src} className="border border-mist bg-fog">
                  <Image
                    src={src}
                    alt={`${frontmatter.title}: gallery image ${i + 1}`}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <article>{content}</article>
        </Container>
      </Section>

      {next && (
        <ChainedNav
          slug={next.frontmatter.slug}
          title={next.frontmatter.title}
          domain={next.frontmatter.domain}
        />
      )}
    </>
  );
}
