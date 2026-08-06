import { MonoLabel } from "@/components/primitives/MonoLabel";

type CalloutProps = {
  children: React.ReactNode;
  label?: string;
};

export function Callout({ children, label = "Constraint" }: CalloutProps) {
  return (
    <div className="my-8 border-l-2 border-mist bg-fog py-5 pl-6 pr-5" data-mdx-callout="">
      {/* text-graphite, not the MonoLabel default text-ash: ash-on-fog is
          4.44:1, just under AA for 12px text. graphite-on-fog is 9.45:1. */}
      <MonoLabel as="p" className="mb-2 text-graphite">
        {label}
      </MonoLabel>
      <div className="max-w-[60ch] text-body-s text-graphite">{children}</div>
    </div>
  );
}
