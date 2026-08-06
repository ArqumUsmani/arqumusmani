import Image from "next/image";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export function Figure({ src, alt, width, height, caption }: FigureProps) {
  return (
    <figure className="my-12 md:my-16" data-mdx-figure="">
      <div className="border border-mist bg-fog">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 800px"
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3">
          <MonoLabel as="p">{caption}</MonoLabel>
        </figcaption>
      )}
    </figure>
  );
}
