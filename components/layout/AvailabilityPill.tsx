export function AvailabilityPill() {
  return (
    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 py-4 font-mono text-mono-label uppercase text-paper transition-colors duration-300 hover:bg-graphite gap-2">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
      </span>
      <span className="font-mono text-mono-label uppercase text-paper">
        Open to Lead &amp; Principal roles
      </span>
    </div>
  );
}
