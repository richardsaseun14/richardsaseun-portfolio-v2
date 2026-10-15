"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

function now() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: site.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Live HH:MM:SS in Lagos time. Renders a placeholder on the server to avoid hydration mismatch. */
export function LagosClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(now());
    const id = setInterval(() => setTime(now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </time>
  );
}
