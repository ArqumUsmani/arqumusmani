import type { MDXComponents } from "mdx/types";
import { Rule } from "@/components/primitives/Rule";
import { Figure } from "@/components/mdx/Figure";
import { FigurePair } from "@/components/mdx/FigurePair";
import { KeyInsight } from "@/components/mdx/KeyInsight";
import { Callout } from "@/components/mdx/Callout";
import { Metrics } from "@/components/mdx/Metrics";
import { Quote } from "@/components/mdx/Quote";
import { Annotated } from "@/components/mdx/Annotated";
import { preventOrphans } from "@/lib/typography";

export const proseComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="mt-20 mb-6 max-w-[22ch] text-display-m text-ink first:mt-0 md:mt-28" {...props}>
      {typeof children === "string" ? preventOrphans(children) : children}
    </h2>
  ),
  h3: (props) => (
    <h3 className="mt-12 mb-4 text-body-l font-medium text-ink" {...props} />
  ),
  p: (props) => <p className="max-w-[68ch] text-body text-graphite [&+&]:mt-6" {...props} />,
  ul: (props) => (
    <ul className="mt-6 max-w-[68ch] list-none space-y-3" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-6 max-w-[68ch] list-none space-y-3" {...props} />
  ),
  li: (props) => (
    <li className="flex gap-3 text-body text-graphite before:mt-[0.7em] before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-signal" {...props} />
  ),
  a: (props) => (
    <a
      className="text-ink underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  hr: () => <Rule className="my-16" />,
  Figure,
  FigurePair,
  KeyInsight,
  Callout,
  Metrics,
  Quote,
  Annotated,
};
