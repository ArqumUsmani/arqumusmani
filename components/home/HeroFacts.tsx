import { MonoLabel } from "@/components/primitives/MonoLabel";
import { PRODUCTS_SHIPPED_COUNT, COMPANIES_COUNT } from "@/data/career";
import { EXPERIENCE_YEARS } from "@/lib/site-config";

const FACTS = [
  { value: `${EXPERIENCE_YEARS}+`, label: "Years" },
  { value: String(PRODUCTS_SHIPPED_COUNT), label: "Products shipped" },
  { value: String(COMPANIES_COUNT), label: "Companies" },
] as const;

// The floating card over the hero portrait — real numbers only, computed
// from data/career.ts (see EXPERIENCE_YEARS / PRODUCTS_SHIPPED_COUNT /
// COMPANIES_COUNT), never hand-typed. Glass treatment matches the nav pill:
// translucent paper + backdrop-blur, so it reads as one consistent material
// across the page rather than a one-off card style.
export function HeroFacts() {
  return (
    <div
      className="rounded-2xl border border-mist/60 p-5 backdrop-blur-md md:p-6"
      style={{ backgroundColor: "color-mix(in srgb, var(--color-paper) 75%, transparent)" }}
    >
      <dl className="grid grid-cols-3 gap-4 md:gap-6">
        {FACTS.map((fact) => (
          <div key={fact.label}>
            <dt className="sr-only">{fact.label}</dt>
            <dd className="font-display text-display-m tabular-nums text-ink">{fact.value}</dd>
            <MonoLabel as="p" className="mt-1">
              {fact.label}
            </MonoLabel>
          </div>
        ))}
      </dl>
    </div>
  );
}
