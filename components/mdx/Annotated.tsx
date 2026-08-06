import Image from "next/image";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type Note = {
  title: string;
  body: string;
};

type AnnotatedProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  notes: Note[];
};

export function Annotated({ src, alt, width, height, notes }: AnnotatedProps) {
  return (
    <div
      className="my-12 grid grid-cols-1 gap-8 md:my-16 md:grid-cols-12 md:gap-8"
      data-mdx-annotated=""
    >
      <div className="md:col-span-7">
        <div className="border border-mist bg-fog">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 700px"
            className="h-auto w-full"
          />
        </div>
      </div>
      <div className="md:col-span-5">
        <ul className="space-y-8">
          {notes.map((note, i) => (
            <li key={note.title} className="flex gap-4">
              <span className="shrink-0 pt-1">
                <MonoLabel>{String(i + 1).padStart(2, "0")}</MonoLabel>
              </span>
              <div>
                <p className="text-body font-medium text-ink">{note.title}</p>
                <p className="mt-1 text-body-s text-graphite">{note.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
