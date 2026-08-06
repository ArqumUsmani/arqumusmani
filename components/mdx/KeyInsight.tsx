import { MonoLabel } from "@/components/primitives/MonoLabel";

type KeyInsightProps = {
  children: React.ReactNode;
  label?: string;
};

export function KeyInsight({ children, label = "Key insight" }: KeyInsightProps) {
  return (
    <div className="my-16 border-t-2 border-signal pt-8 md:my-24 md:pt-10" data-mdx-key-insight="">
      <MonoLabel as="p">{label}</MonoLabel>
      {/* children arrives pre-wrapped in <p> by the MDX paragraph component
          (className max-w-[68ch] text-body text-graphite), so this is a div —
          nesting <p> in <p> is invalid HTML and breaks hydration — and the
          child selectors below force the display-m statement styling to win
          over that inherited paragraph styling regardless of which wins DOM-wise. */}
      <div
        className="mt-6 max-w-[28ch] text-display-m text-ink [&>p]:m-0 [&>p]:max-w-none [&>p]:text-inherit [&>p]:[font:inherit] [&>p]:[letter-spacing:inherit]"
      >
        {children}
      </div>
    </div>
  );
}
