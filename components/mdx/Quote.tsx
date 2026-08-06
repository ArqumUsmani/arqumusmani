import { MonoLabel } from "@/components/primitives/MonoLabel";

type QuoteProps = {
  children: React.ReactNode;
  attribution?: string;
};

export function Quote({ children, attribution }: QuoteProps) {
  return (
    <blockquote className="my-12 border-l-2 border-signal py-1 pl-6 md:my-16" data-mdx-quote="">
      {/* children arrives pre-wrapped in <p> by the MDX paragraph component —
          a div here (not <p>) avoids nesting <p> in <p>. hanging-punctuation
          pulls a leading quote mark outside the text block on supporting
          browsers; unsupported browsers just keep the mark inline. */}
      <div
        className="max-w-[50ch] text-body-l text-ink [hanging-punctuation:first] [&>p]:m-0 [&>p]:max-w-none [&>p]:text-inherit [&>p]:[font:inherit] [&>p]:[letter-spacing:inherit]"
      >
        {children}
      </div>
      {attribution && <MonoLabel as="p" className="mt-4">{attribution}</MonoLabel>}
    </blockquote>
  );
}
