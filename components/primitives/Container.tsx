import { cn } from "@/lib/cn";

type ContainerProps = React.ComponentProps<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-page px-[clamp(1.25rem,5vw,6rem)]",
        className,
      )}
      {...props}
    />
  );
}
