"use client";

import { useState } from "react";
import type { GameItem } from "@/lib/steam";
import { Slide } from "./Carousel";
import { Placeholder } from "./primitives";

/** One cover card in a Steam games carousel. Falls back to the header art, then a placeholder. */
export function GameSlide({ item }: { item: GameItem }) {
  const [failed, setFailed] = useState(0);
  const src = [item.cover, item.fallbackCover][failed];

  return (
    <Slide>
      <a href={item.href} target="_blank" rel="noreferrer" className="block no-underline">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote Steam CDN art, already sized
          <img
            src={src}
            alt={`${item.title} cover`}
            loading="lazy"
            onError={() => setFailed((n) => n + 1)}
            className="aspect-[2/3] w-full border border-line object-cover"
          />
        ) : (
          <Placeholder label="[Cover]" className="aspect-[2/3]" />
        )}
      </a>
      <div className="flex flex-col gap-1.5">
        <a href={item.href} target="_blank" rel="noreferrer" className="text-lg font-semibold text-ink no-underline">
          {item.title}
        </a>
        <span className="meta text-muted-foreground">{item.meta}</span>
      </div>
    </Slide>
  );
}
