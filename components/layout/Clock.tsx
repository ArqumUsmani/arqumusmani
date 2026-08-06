"use client";

import { useEffect, useState } from "react";

// Client-only: renders nothing until mounted so the server-rendered markup
// never has to guess the visitor's clock, avoiding a hydration mismatch.
// Time only, no city, deliberately: this site doesn't surface where Arqum
// is based (see SITE_CONFIG / lib/json-ld.ts).
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="font-mono text-mono-label uppercase tabular-nums text-ash" suppressHydrationWarning>
      {time}
    </span>
  );
}
