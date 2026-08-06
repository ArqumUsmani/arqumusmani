import type { Metadata } from "next";
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

      <Section
        spec={{ index: "01 / HERO", type: "display-l · 500", space: "64 / 0" }}
        className="pb-0 pt-16 md:pt-24"
      >
        <Container>
          <Reveal inView={false}>
            <MonoLabel as="p" className="mb-6">
              {frontmatter.domain} · {frontmatter.year}
            </MonoLabel>
            <h1 className="max-w-[22ch] text-display-l text-ink">{preventOrphans(frontmatter.title)}</h1>
            <p className="mt-6 max-w-[60ch] text-body-l text-graphite">{frontmatter.thesis}</p>
          </Reveal>
          {frontmatter.confidential && (
            <Reveal inView={false} index={1} className="mt-8">
              <ConfidentialNotice />
            </Reveal>
          )}
        </Container>

        <div className="mt-12 w-full border-y border-mist bg-fog md:mt-16">
          <Image
            src={frontmatter.cover}
            alt={`Cover image for ${frontmatter.title}`}
            width={1920}
            height={1200}
            priority
            sizes="100vw"
            className="h-auto max-h-[70vh] w-full object-cover"
          />
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
        <Section spec={{ index: "02 / GALLERY", type: "figure grid", space: "64 / 0" }} className="pb-0">
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

      <Section spec={{ index: "03 / ARTICLE", type: "body · 400", space: "96 / 96" }}>
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
