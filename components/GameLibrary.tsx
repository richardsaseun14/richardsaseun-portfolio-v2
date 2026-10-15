"use client";

import { useState } from "react";
import type { Game } from "@/lib/content";
import { Carousel, Slide } from "./Carousel";
import { Placeholder } from "./primitives";

const shelves = ["Playing", "Finished"] as const;

export function GameLibrary({ games }: { games: Game[] }) {
  const [shelf, setShelf] = useState<(typeof shelves)[number]>("Playing");
  const shown = games.filter((g) => g.status === shelf);

  const tabs = (
    <div role="group" aria-label="Filter games" className="flex flex-wrap gap-2.5">
      {shelves.map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={shelf === s}
          onClick={() => setShelf(s)}
          className={`meta h-11 cursor-pointer border px-[18px] ${
            shelf === s ? "border-ink bg-ink text-bg" : "border-line text-ink hover:border-ink"
          }`}
        >
          {s} ({games.filter((g) => g.status === s).length})
        </button>
      ))}
    </div>
  );

  return (
    <Carousel id="games" eyebrow="Games" title="The game library." controls={tabs} key={shelf}>
      {shown.map((g, i) => (
        <Slide key={`${g.title}-${i}`} width={220}>
          <Placeholder label="[Cover]" className="aspect-[3/4]" />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">{g.title}</span>
            <span className="meta text-muted-foreground">{g.meta}</span>
          </div>
          <span
            className={`meta self-start px-2 py-1 text-[11px] tracking-[0.06em] ${
              g.status === "Playing" ? "bg-accent text-on-accent" : "border border-line text-muted-foreground"
            }`}
          >
            {g.status === "Playing" ? "Now playing" : "Finished"}
          </span>
        </Slide>
      ))}
    </Carousel>
  );
}
