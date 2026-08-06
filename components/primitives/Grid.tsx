import { cn } from "@/lib/cn";

type GridProps = React.ComponentProps<"div">;

export function Grid({ className, ...props }: GridProps) {
  return (
    <div
      className={cn("grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8", className)}
      {...props}
    />
  );
}
