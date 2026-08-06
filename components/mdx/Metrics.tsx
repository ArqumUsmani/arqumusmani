import { MonoLabel } from "@/components/primitives/MonoLabel";

type MetricItem = {
  value: string;
  label: string;
};

type MetricsProps = {
  items: MetricItem[];
};

export function Metrics({ items }: MetricsProps) {
  return (
    <div
      className="my-12 grid grid-cols-2 gap-x-6 gap-y-10 md:my-16 md:grid-cols-4 md:gap-x-8"
      data-mdx-metrics=""
    >
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-display-l tabular-nums text-ink">{item.value}</p>
          <MonoLabel as="p" className="mt-3">
            {item.label}
          </MonoLabel>
        </div>
      ))}
    </div>
  );
}
