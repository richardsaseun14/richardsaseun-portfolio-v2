"use client";

import Link from "next/link";
import { useState } from "react";
import { projectFilters, type Project } from "@/lib/content";
import { ArrowUpRight } from "./Icons";

export function LabsIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div role="group" aria-label="Filter projects" className="mt-16 flex flex-wrap gap-2.5">
        {projectFilters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`meta h-11 cursor-pointer border px-[18px] ${
              filter === f ? "border-ink bg-ink text-bg" : "border-line text-ink hover:border-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-ink">
        {shown.map((p) => (
          <Link
            key={p.slug}
            href={`/labs/${p.slug}`}
            className="group grid items-center gap-x-10 gap-y-6 border-b border-line py-7 text-ink no-underline hover:bg-surface hover:text-ink [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]"
          >
            <div className="stripes aspect-[16/10] w-40 border border-line" />
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em]">{p.name}</span>
              <span className="text-muted-foreground">{p.blurb}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="meta flex flex-col gap-1 text-muted-foreground">
                <span>{p.type}</span>
                <span>
                  {p.role} · {p.year}
                </span>
              </div>
              <span className="grid size-12 shrink-0 place-items-center border border-line group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
