# ausmani.com

Arqum Usmani's portfolio — Next.js 16 (App Router, Turbopack), Tailwind CSS v4, MDX content, Motion for animation.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run build && npm run start` runs the production build locally — use this (not `next dev`) when checking Lighthouse or anything animation-timing related, since dev mode is unoptimized and unrepresentative.

## Adding a case study

1. Create `content/work/your-slug.mdx`. Copy an existing entry (e.g. `content/work/cloudbloom.mdx`) as a starting template for the required frontmatter fields and section order. Never commit a file with `TODO`, `Lorem`, or `placeholder` in it — `scripts/check-content.mjs` fails the build if it finds one.
2. Fill in the frontmatter. It's validated with Zod (`lib/content/schema.ts`) — a bad or missing field fails the build with a clear error naming the file and field, it won't fail silently:
   - `slug` must exactly match the filename (without `.mdx`).
   - `domain` must be one of `Healthcare | AI | SaaS | E-commerce`.
   - `outcomes` needs at least one `{ value, label }` pair — `outcomes[0]` is what shows on the home page card and the `/work` index row.
   - `confidential: true` triggers the genericised-client treatment (see below) — when true, `client` should already hold the genericised name, not the real one.
3. Write the body in order: `## Context`, `## Problem`, `## Constraints`, `## Research`, a `<KeyInsight>`, `## Explorations`, `## Solution`, `## Outcomes` (with a `<Metrics>` block), `## Reflection`. The template renders the hero/meta bar/gallery/next-case-study nav around this automatically — don't repeat them in the body.
4. Use the MDX components from `components/mdx/`: `<Figure>`, `<FigurePair>`, `<KeyInsight>`, `<Callout>`, `<Metrics>`, `<Quote>`, `<Annotated>`. They only accept plain values in JSX attributes (arrays/objects work) because `blockJS: false` is set in `lib/content/work.ts` — see the comment there before changing it.
5. Add images to `public/work/your-slug/` and reference them by path in frontmatter (`cover`, `gallery`) and in `<Figure>`/`<Annotated>` calls. Placeholder images were generated with `graphite` (`#3d3d3b`) as the fill, not `ink` — that's deliberate, see "Dark mode" below.
6. Set `featured: true` to put it on the home page (exactly 3 should be featured at a time — that section assumes it fits a 3-row layout) and `order` to control position in `/work` and the chained "next case study" nav.

No routing work needed — `generateStaticParams` picks up every file in `content/work/` automatically, including the OG image route.

## Adding a note

Same pattern, smaller: create `content/notes/your-slug.mdx` with `slug, title, excerpt, date, tags[], published`. Set `published: false` to keep a draft out of the index, the RSS feed, and `generateStaticParams` without deleting the file. Body is plain prose — it reuses the same MDX component set as case studies.

## Changing design tokens

Every token lives in `app/globals.css`, in the `@theme` block — colour, type scale, radius, and the motion curve. Change it there, not per-component:

- **Colour**: `--color-paper/ink/graphite/ash/mist/fog/signal`. The `.dark` block below re-declares all seven for dark mode — if you add an eighth colour token, it needs a dark-mode value too, or it'll go nearly invisible on the dark background (this happened once with `graphite`/`ash`/`mist`/`fog` — see the contrast comment above `.dark`).
- **Type scale**: `--text-display-xl/l/m`, `--text-body-l/body/body-s`, `--text-mono-label`. Each bundles size, line-height, letter-spacing, and weight as one Tailwind v4 compound token (`--text-display-xl--line-height` etc.) — change the whole step there, not with one-off `leading-*`/`tracking-*` overrides at call sites.
- **Motion**: `--ease-signature` is the one curve the whole site uses. It's also wired as `--default-transition-timing-function`, so any plain Tailwind `transition-*` utility gets it automatically without needing an explicit `ease-*` class — don't hand-roll a different curve for a "quick" interaction, use a shorter `duration-*` instead. The `Reveal` primitive (`components/primitives/Reveal.tsx`) is the standard entrance animation (600ms, 60ms stagger via its `index` prop); pass `inView={false}` only for content that's guaranteed to be on screen at first paint (heroes) — it skips the `IntersectionObserver` round-trip that otherwise measurably delays LCP.
- **Radius**: capped at 2px everywhere except `rounded-full`, which is reserved for the availability status dot. Don't introduce a third radius value.

`/styleguide` renders every token live (colour swatches, type samples, spacing scale) — check it after any token change. It's excluded from the sitemap and marked `noindex` since it's internal.

## Dark mode

Class-based (`.dark` on `<html>`), toggled by `components/layout/ThemeToggle.tsx`, persisted via a `theme` cookie, applied by a blocking inline script in `app/layout.tsx` (before first paint, so there's no flash — and so no page has to opt into dynamic rendering just to read the cookie server-side). If no cookie is set, it falls back to `prefers-color-scheme`.

Placeholder images use a fixed `graphite` fill (not the `paper`/`ink` tokens) specifically so they stay visible as a distinct block against both a light and a near-black page — an `ink`-filled placeholder disappears into a dark-mode background. Keep that in mind if you regenerate placeholders or add new ones before real photography/screenshots replace them.

## Content model reference

- Frontmatter schemas: `lib/content/schema.ts` (Zod — this is the source of truth for what fields exist).
- Loaders: `lib/content/work.ts`, `lib/content/notes.ts`.
- Confidential handling (`confidential: true`): renders the (already-genericised) client name, shows no logo, and adds the small mono `Client details withheld…` notice (`components/work/ConfidentialNotice.tsx`). The genericising happens at the content level — the component just gates the notice and trusts `client` is already safe to show.
- `lib/site-config.ts` is the single source for name/email/socials/base URL — sitemap, robots, RSS, JSON-LD, the footer, and the contact page all read from it. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is live; nothing else needs to change.

## Verifying a change

- `npm run build` — full static generation; frontmatter errors and most content bugs surface here, not at runtime.
- `npm run lint`
- No project-specific a11y/perf test scripts are checked in, but the build was last verified with Playwright + `@axe-core/playwright` (0 violations, all pages, both themes) and Lighthouse (mobile + desktop, all four categories) against `npm run start`. If you add a dependency on either, install with `npm install -D playwright @axe-core/playwright` and `npx playwright install chromium` first.
