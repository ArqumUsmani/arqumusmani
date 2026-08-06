import { cn } from "@/lib/cn";

type RuleProps = React.ComponentProps<"hr">;

export function Rule({ className, ...props }: RuleProps) {
  return <hr className={cn("border-t border-mist", className)} {...props} />;
}
