import Image from "next/image";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type FigurePairItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type FigurePairProps = {
  items: [FigurePairItem, FigurePairItem];
};

export function FigurePair({ items }: FigurePairProps) {
  return (
    <div className="my-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:my-16 md:gap-8" data-mdx-figure-pair="">
      {items.map((item) => (
        <figure key={item.src}>
          <div className="border border-mist bg-fog">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 768px) 100vw, 400px"
              className="h-auto w-full"
            />
          </div>
          {item.caption && (
            <figcaption className="mt-3">
              <MonoLabel as="p">{item.caption}</MonoLabel>
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
