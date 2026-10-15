import type { Metadata } from "next";
import { WorkIndex } from "@/components/WorkIndex";
import { ExploreCards } from "@/components/ExploreCards";
import { ButtonLink, PageIntro, SectionHeading } from "@/components/primitives";
import { mailto, projects, sideProjects, type SideProject } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

const statusStyle: Record<SideProject["status"], string> = {
  Live: "bg-accent text-on-accent",
  Building: "border border-accent text-ink",
  Archived: "border border-line text-muted-foreground",
};

export default function WorkPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Case studies"
        eyebrowRight="2017 – 2026"
        title="Work"
        intro="The problem, the thinking, and what I actually built, with screenshots and the numbers that moved."
      />

      <section className="container-x">
        <WorkIndex projects={projects} />
      </section>

      <section aria-labelledby="side-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading
          id="side-title"
          eyebrow="Side projects"
          title="Small builds & experiments."
          aside={<span className="eyebrow">{sideProjects.length} builds so far</span>}
        >
          <p className="mt-1 max-w-[560px] text-pretty text-muted-foreground">
            Ideas that wouldn&apos;t leave me alone. Built fast, shipped scrappy, tinkered with in public.
          </p>
        </SectionHeading>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
          {sideProjects.map((sp, i) => (
            <article key={`${sp.name}-${i}`} className="flex min-h-60 flex-col gap-3.5 border border-line bg-surface p-6 hover:border-ink">
              <div className="flex items-center justify-between gap-3">
                <span className="meta text-muted-foreground">{sp.date}</span>
                <span className={`meta px-2 py-1 text-[11px] tracking-[0.06em] ${statusStyle[sp.status]}`}>{sp.status}</span>
              </div>
              <h3 className="font-display text-[clamp(22px,6vw,26px)] leading-[1.05] font-extrabold tracking-[-0.025em]">{sp.name}</h3>
              <p className="grow text-pretty text-muted-foreground">{sp.blurb}</p>
              <div className="meta flex flex-wrap gap-1.5 text-[11px]">
                {sp.tags.map((t) => (
                  <span key={t} className="border border-line px-2 py-1 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="meta flex gap-6 border-t border-line pt-3.5">
                {sp.demo && (
                  <a href={sp.demo} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center no-underline">
                    Try it ↗
                  </a>
                )}
                {sp.code && (
                  <a href={sp.code} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center no-underline">
                    Code ↗
                  </a>
                )}
              </div>
            </article>
          ))}
          <div className="flex min-h-60 flex-col items-start justify-center gap-2.5 border border-dashed border-line p-6 text-muted-foreground">
            <span className="font-mono text-[22px] text-accent">+</span>
            <span className="font-semibold text-ink">Next experiment</span>
            <span>Something&apos;s always brewing.</span>
          </div>
        </div>
      </section>

      <section className="container-x pt-16 pb-20 sm:pt-24 sm:pb-30">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-line bg-surface p-6 sm:p-10">
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-[clamp(24px,7vw,32px)] font-extrabold tracking-[-0.03em]">Some work is under NDA.</span>
            <span className="text-muted-foreground">Happy to walk through it on a call.</span>
          </div>
          <ButtonLink href={mailto} full>
            Discuss a role
          </ButtonLink>
        </div>
      </section>

      <ExploreCards items={["about", "sideQuests"]} />
    </main>
  );
}
