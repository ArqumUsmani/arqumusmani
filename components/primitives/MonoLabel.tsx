import { cn } from "@/lib/cn";

type MonoLabelProps = React.HTMLAttributes<HTMLElement> & {
  as?: "span" | "div" | "p";
};

export function MonoLabel({ className, as: Tag = "span", ...props }: MonoLabelProps) {
  return (
    <Tag
      className={cn("font-mono text-mono-label uppercase text-ash", className)}
      {...props}
    />
  );
}
