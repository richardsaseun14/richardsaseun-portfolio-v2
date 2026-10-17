"use client";

import { useEffect, useState } from "react";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

/** Interactive star field behind the home hero. Skipped entirely for reduced-motion users. */
export function HeroStars() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;

  return (
    <GravityStarsBackground
      aria-hidden
      starsOpacity={0.5}
      className="pointer-events-none absolute inset-0 -z-10 text-accent"
    />
  );
}
