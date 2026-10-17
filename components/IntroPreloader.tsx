"use client";

import { useEffect, useState } from "react";
import WeightSweepPreloader from "@/components/ui/weight-sweep-preloader";

/** Full-screen type-specimen intro shown on every hard load. */
export function IntroPreloader({ label }: { label: string }) {
  const [active, setActive] = useState(true);

  // Lock page scroll only while the gate is up.
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.removeProperty("overflow");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={
        {
          "--wsp-line-style": "normal",
          "--wsp-line-weight": 700,
          "--wsp-panel": "var(--accent)",
          "--wsp-panel-ink": "var(--on-accent)",
        } as React.CSSProperties
      }
    >
      <WeightSweepPreloader
        height="100svh"
        palette={{ paper: "var(--bg)", ink: "var(--ink)" }}
        weights={[200, 900]}
        fontFamily="var(--font-unbounded), sans-serif"
        monoFamily="var(--font-jetbrains), monospace"
        serifFamily="var(--font-figtree), sans-serif"
        label={label}
        caption="Thinking it through"
        message="Made with intent."
        onComplete={() => setActive(false)}
      />
    </div>
  );
}
