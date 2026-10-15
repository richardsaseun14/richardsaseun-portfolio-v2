import type { Metadata } from "next";
import { ExploreCards } from "@/components/ExploreCards";
import { LagosClock } from "@/components/LagosClock";
import { Download } from "@/components/Icons";
import { ButtonLink, PageIntro, SectionHeading } from "@/components/primitives";
import { capabilities, experience, mailto, quickFacts, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About: Experience & Services",
  description: "Where I've worked, what I can help with, and how to reach me.",
};

const cellGrid =
  "grid border-t border-l border-t-ink border-l-line [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]";
const cell = "border-r border-b border-line";

export default function AboutPage() {
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");
  const github = site.socials.find((s) => s.label === "GitHub");

  return (
    <main>
      <PageIntro
        eyebrow="About"
        eyebrowRight="Last updated [October 2026]"
        title="About"
        action={
          <a
            href={site.cvUrl}
            className="inline-flex h-12 items-center gap-2.5 bg-ink px-5 font-semibold sm:h-14 sm:px-7 text-bg no-underline hover:bg-accent hover:text-on-accent"
          >
            <Download /> Download CV
          </a>
        }
        intro="Where I've worked, the kind of work I can take on for you, and a few quick facts for when you just need the overview."
      />

      <section aria-labelledby="history-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading id="history-title" eyebrow="Experience" title="Where I've worked." aside={<span className="eyebrow">Newest first</span>} />
        <ol className="border-t border-ink">
          {experience.map((job, i) => (
            <li key={i} className="flex flex-wrap gap-x-10 gap-y-4 border-b border-line py-7 hover:bg-surface sm:py-8">
              <div className="flex basis-full flex-row flex-wrap items-center gap-2.5 sm:flex-[0_0_200px] sm:flex-col sm:items-start">
                <span className="font-mono text-[13px] text-muted-foreground">{job.period}</span>
                {job.current && (
                  <span className="meta bg-accent px-2 py-1 text-[11px] tracking-[0.06em] text-on-accent">Current</span>
                )}
              </div>
              <div className="flex flex-[1_1_320px] flex-col gap-3">
                <h3 className="font-display text-[clamp(24px,6.5vw,28px)] font-extrabold tracking-[-0.025em]">{job.company}</h3>
                <span className="font-medium">{job.role}</span>
                <ul className="flex flex-col gap-1.5 text-muted-foreground">
                  {job.notes.map((n, j) => (
                    <li key={j} className="flex gap-3">
                      <span aria-hidden className="font-mono text-accent">
                        +
                      </span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cap-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading id="cap-title" eyebrow="Services" title="What I can work on." aside={<span className="eyebrow">Bring me in for</span>} />
        <ul className={cellGrid}>
          {capabilities.map((c) => (
            <li key={c.title} className={`${cell} flex flex-col gap-2.5 p-6 hover:bg-surface sm:p-7`}>
              <span aria-hidden className="font-mono text-lg text-accent">
                +
              </span>
              <h3 className="text-[22px] font-semibold tracking-[-0.015em]">{c.title}</h3>
              <p className="text-muted-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="facts-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading id="facts-title" eyebrow="Overview" title="Quick facts." aside={<span className="eyebrow">The CV in 30 seconds</span>} />
        <dl className={cellGrid}>
          {quickFacts.map((f) => (
            <div key={f.label} className={`${cell} flex flex-col gap-2 p-6`}>
              <dt className="meta text-muted-foreground">{f.label}</dt>
              <dd className="text-[19px] font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="reach-title" className="container-x py-20 sm:py-30">
        <div className="flex flex-wrap gap-x-18 gap-y-10 bg-invert sm:gap-y-14 p-[clamp(28px,5vw,72px)] text-invert-ink">
          <div className="flex min-w-0 flex-[999_1_min(320px,100%)] flex-col justify-between gap-10">
            <div className="flex flex-col gap-5">
              <span className="meta text-[13px] opacity-75">Reach out</span>
              <h2 id="reach-title" className="font-display text-[clamp(36px,6vw,96px)] leading-[0.9] font-black tracking-[-0.045em] uppercase">
                Let&apos;s build
                <br />
                something<span className="text-accent">.</span>
              </h2>
              <p className="max-w-[440px] text-lg opacity-85">
                Hiring for an engineering role, or need a product built? Pick a channel. {site.replyTime}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={mailto} variant="accent" full>
                Email me
              </ButtonLink>
              {linkedin && (
                <ButtonLink href={linkedin.href} variant="ghost-invert" icon={false}>
                  LinkedIn ↗
                </ButtonLink>
              )}
              {github && (
                <ButtonLink href={github.href} variant="ghost-invert" icon={false}>
                  GitHub ↗
                </ButtonLink>
              )}
            </div>
          </div>
          <dl className="flex min-w-0 flex-[1_1_min(320px,100%)] flex-col self-end text-[15px]">
            {[
              { k: "Location", v: site.location },
              {
                k: "Time zone",
                v: (
                  <>
                    {site.tzLabel} · UTC+1 · <LagosClock />
                  </>
                ),
              },
              {
                k: "Availability",
                v: (
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-live" /> Open to roles &amp; select projects
                  </span>
                ),
              },
              { k: "Works", v: "Remote-friendly" },
            ].map((row, i, arr) => (
              <div
                key={row.k}
                className={`flex justify-between gap-4 border-t border-[rgba(128,128,128,0.35)] py-4 ${
                  i === arr.length - 1 ? "border-b" : ""
                }`}
              >
                <dt className="opacity-70">{row.k}</dt>
                <dd className="text-right">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ExploreCards items={["work", "sideQuests"]} />
    </main>
  );
}
