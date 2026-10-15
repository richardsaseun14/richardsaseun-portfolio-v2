"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "./Icons";

const navBtn = "grid size-11 cursor-pointer place-items-center border border-line text-ink hover:border-ink";

/** Horizontal, swipeable rail with arrow buttons. Children are the slides. */
export function Carousel({
  id,
  eyebrow,
  title,
  controls,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const slide = (dir: number) => rail.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <section aria-labelledby={id} className="mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={id} className="section-title">
            {title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {controls}
          <div className="flex gap-2">
            <button type="button" aria-label={`Scroll ${eyebrow.toLowerCase()} left`} onClick={() => slide(-1)} className={navBtn}>
              <ArrowLeft />
            </button>
            <button type="button" aria-label={`Scroll ${eyebrow.toLowerCase()} right`} onClick={() => slide(1)} className={navBtn}>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
      <div ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1">
        {children}
      </div>
    </section>
  );
}

export function Slide({ children, width = 260 }: { children: React.ReactNode; width?: number }) {
  return (
    <div className="flex shrink-0 snap-start flex-col gap-3.5" style={{ flexBasis: width, width }}>
      {children}
    </div>
  );
}
