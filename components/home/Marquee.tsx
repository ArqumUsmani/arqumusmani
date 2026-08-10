const ITEMS = [
  "Product Design",
  "Design Systems",
  "Front-End Engineering",
  "Healthcare",
  "AI Interfaces",
  "SaaS",
  "Research",
  "Prototyping",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {ITEMS.map((item) => (
        <div key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-mono text-mono-label uppercase text-graphite md:px-8 md:text-body">
            {item}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-signal" />
        </div>
      ))}
    </div>
  );
}

// A keyword strip, not decoration: disciplines and domains a scanner can
// read in three seconds. Pure CSS loop (transform only, doubled track —
// see the marquee keyframes in globals.css for why); no scroll listeners,
// no JS-driven speed changes. Paused on hover/focus-within so it never
// fights someone trying to read it, and the whole visual track is
// aria-hidden with the real content present once as a plain list for
// screen readers.
export function Marquee() {
  return (
    <div className="border-y border-mist py-6">
      <div className="overflow-hidden">
        <div className="flex w-max animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          <Track />
          <Track />
        </div>
      </div>
      <ul className="sr-only">
        {ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
