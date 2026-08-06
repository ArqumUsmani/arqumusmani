import Image from "next/image";

type PortraitFrameProps = {
  sizes: string;
  priority?: boolean;
  className?: string;
};

// The shared portrait treatment for the About hero and its home-page teaser:
// no bounding card, a warm glow bleeding past the image edges.
export function PortraitFrame({ sizes, priority, className }: PortraitFrameProps) {
  return (
    <div className={className}>
      <div className="relative overflow-visible">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-16 [background:radial-gradient(circle_at_50%_38%,color-mix(in_srgb,var(--color-signal)_28%,transparent),transparent_60%)] blur-2xl"
        />
        <Image
          src="/about/portrait.svg"
          alt="Portrait of Arqum Usmani"
          width={900}
          height={1120}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className="relative h-auto w-full"
        />
      </div>
    </div>
  );
}
