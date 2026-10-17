"use client";

import { useEffect, useState } from "react";
import WeightSweepPreloader from "@/components/ui/weight-sweep-preloader";
import { PREF_KEYS } from "@/lib/prefs";

/** Skip unless the visitor landed on the home page and hasn't seen the intro this session. */
function shouldSkipIntro(): boolean {
  if (window.location.pathname !== "/") return true;
  try {
    return sessionStorage.getItem(PREF_KEYS.intro) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(PREF_KEYS.intro, "1");
  } catch {
    // Storage blocked: the intro simply plays again next load.
  }
  document.documentElement.dataset.introSeen = "1";
}

/**
 * Full-screen type-specimen intro shown when a session lands on the home page.
 * Returning loads are hidden before paint by introInitScript + the .intro-gate CSS rule.
 */
export function IntroPreloader({ label }: { label: string }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (shouldSkipIntro()) setActive(false);
  }, []);

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
      className="intro-gate fixed inset-0 z-[200]"
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
        onComplete={() => {
          markIntroSeen();
          setActive(false);
        }}
      />
    </div>
  );
}
