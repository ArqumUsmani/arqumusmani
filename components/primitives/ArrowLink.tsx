import Link from "next/link";
import { cn } from "@/lib/cn";

type ArrowLinkProps = React.ComponentProps<typeof Link> & {
  variant?: "body" | "mono";
};

export function ArrowLink({
  className,
  variant = "body",
  children,
  ...props
}: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2 text-ink",
        variant === "mono"
          ? "font-mono text-mono-label uppercase"
          : "text-body",
        className,
      )}
      {...props}
    >
      <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-150 group-hover:decoration-signal">
        {children}
      </span>
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="shrink-0 -translate-y-px transition-transform duration-300 ease-signature group-hover:translate-x-1"
      >
        <path
          d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
