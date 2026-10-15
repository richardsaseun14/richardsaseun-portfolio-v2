"use client";

import Image from "next/image";
import { usePrefs } from "./PrefsProvider";

/** The big hero name. Hovering reveals the portrait (and plays a sparkle when sound is on). */
export function HeroName() {
  const { sparkle } = usePrefs();
  return (
    <div className="hero-name relative inline-block max-w-full" onMouseEnter={sparkle}>
      <h1 id="hero-title" className="page-title cursor-default" style={{ fontSize: "clamp(52px, 10.4vw, 168px)" }}>
        Richard
        <br />
        Saseun<span className="text-accent">.</span>
      </h1>
      <figure className="hero-photo pointer-events-none absolute top-1/2 left-full z-[5] aspect-[2/3] w-[clamp(180px,20vw,280px)] overflow-hidden border-2 border-ink bg-surface shadow-[12px_12px_0_var(--accent)]">
        <Image
          src="/richard-portrait.jpg"
          alt="Portrait of Richard Saseun"
          fill
          sizes="280px"
          className="object-cover"
          priority
        />
      </figure>
    </div>
  );
}
