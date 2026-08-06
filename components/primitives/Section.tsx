import { cn } from "@/lib/cn";

export type SpecRailValues = {
  /** e.g. "04 / WORK" */
  index: string;
  type?: string;
  grid?: string;
  space?: string;
};

type SectionProps = React.ComponentProps<"section"> & {
  spec?: SpecRailValues;
};

export function Section({ className, spec, ...props }: SectionProps) {
  return (
    <section
      data-spec-rail={spec ? JSON.stringify(spec) : undefined}
      className={cn("py-24 md:py-40", className)}
      {...props}
    />
  );
}
