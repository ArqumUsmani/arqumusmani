import Image from "next/image";

type PortraitFrameProps = {
  sizes: string;
  priority?: boolean;
  className?: string;
};

// The shared portrait treatment for the About hero and its home-page teaser:
// a warm glow bleeding past the image edges, plus a thin border so the
// photo reads as an intentional card rather than a missing-image box. The
// source photo has a black background, which blends straight into the dark
// theme's paper color with no filter needed — the border is what gives it
// definition in light mode instead.
export function PortraitFrame({ sizes, priority, className }: PortraitFrameProps) {
  return (
    <div className={className}>
      <div className="relative overflow-visible">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-16 [background:radial-gradient(circle_at_50%_38%,color-mix(in_srgb,var(--color-signal)_28%,transparent),transparent_60%)] blur-2xl"
        />
        <Image
          src="/about/Side.png"
          alt="Portrait of Arqum Usmani"
          width={1236}
          height={2160}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className="relative h-auto w-full"
        />
      </div>
    </div>
  );
}
