import { cn } from "@/lib/cn";

type SectionProps = React.ComponentProps<"section">;

export function Section({ className, ...props }: SectionProps) {
  return <section className={cn("py-24 md:py-40", className)} {...props} />;
}
