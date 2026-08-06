import { Container } from "@/components/primitives/Container";
import { MonoLabel } from "@/components/primitives/MonoLabel";

type MetaBarProps = {
  role: string;
  team: string;
  timeline: string;
  platform: string;
  domain: string;
  year: number;
};

const FIELDS: Array<{ key: keyof MetaBarProps; label: string }> = [
  { key: "role", label: "Role" },
  { key: "team", label: "Team" },
  { key: "timeline", label: "Timeline" },
  { key: "platform", label: "Platform" },
  { key: "domain", label: "Domain" },
  { key: "year", label: "Year" },
];

export function MetaBar(props: MetaBarProps) {
  return (
    <div className="border-y border-mist bg-paper/95 backdrop-blur md:sticky md:top-20 md:z-30 lg:top-24">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 md:grid-cols-6 md:gap-4 md:py-5">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <dt>
                <MonoLabel as="p">{label}</MonoLabel>
              </dt>
              <dd className="mt-1 text-body-s tabular-nums text-ink">{props[key]}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
