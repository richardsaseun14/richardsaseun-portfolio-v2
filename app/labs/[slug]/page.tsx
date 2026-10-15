import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExploreCards } from "@/components/ExploreCards";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { Placeholder } from "@/components/primitives";
import { projects } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? project.name : "Case study" };
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-wrap gap-x-16 gap-y-8">
      <h2 id={id} className="flex-[1_1_300px] font-display text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em]">
        {title}
      </h2>
      <div className="flex max-w-[760px] flex-[999_1_560px] flex-col gap-5 text-[19px] leading-[1.6]">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const cs = project?.caseStudy;
  if (!project || !cs) notFound();
  const next = projects[(index + 1) % projects.length];

  return (
    <main>
      <section className="container-x pt-12">
        <Link href="/labs" className="meta inline-flex min-h-11 items-center gap-2 text-[13px] no-underline">
          <ArrowLeft size={16} /> Back to Labs
        </Link>
        <div className="meta mt-8 flex flex-wrap gap-2">
          <span className="bg-accent px-2.5 py-1.5 text-on-accent">Case study</span>
          <span className="border border-line px-2.5 py-1.5 text-muted-foreground">{project.type}</span>
          <span className="border border-line px-2.5 py-1.5 text-muted-foreground">{cs.industry}</span>
        </div>
        <h1 className="page-title mt-6">
          {project.name}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-9 max-w-[820px] text-[clamp(22px,2.2vw,30px)] leading-[1.25] tracking-[-0.02em] text-pretty">
          {cs.summary}
        </p>

        <dl className="mt-14 grid border-t border-b border-t-ink border-b-line [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
          {[
            { k: "Role", v: project.role },
            { k: "Timeline", v: cs.timeline },
            { k: "Team", v: cs.team },
            { k: "Stack", v: cs.stack },
          ].map((row, i) => (
            <div key={row.k} className={`flex flex-col gap-1.5 py-5 ${i === 0 ? "pr-5" : "border-l border-line px-5"}`}>
              <dt className="meta text-muted-foreground">{row.k}</dt>
              <dd className="font-medium">{row.v}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-1.5 border-l border-line px-5 py-5">
            <dt className="meta text-muted-foreground">Links</dt>
            <dd className="flex gap-4 font-medium">
              {cs.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-label="Hero screenshot" className="container-x pt-14">
        <Placeholder label="[Hero screenshot: web + mobile together]" className="aspect-[2/1]" />
      </section>

      {project.metrics && (
        <section aria-label="Outcomes" className="container-x pt-14">
          <div className="grid bg-invert text-invert-ink [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
            {project.metrics.map((m) => (
              <div key={m.label} className="p-9">
                <div className="font-display text-[64px] leading-none font-extrabold tracking-[-0.04em]">
                  {m.value}
                  <span className="text-accent">{m.accent}</span>
                </div>
                <div className="meta mt-3 opacity-75">{m.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <article className="container-x flex flex-col gap-24 pt-30">
        <Block id="cs-problem" title="The problem">
          <p className="text-pretty">{cs.problem[0]}</p>
          {cs.problem.slice(1).map((p) => (
            <p key={p} className="text-pretty text-muted-foreground">
              {p}
            </p>
          ))}
        </Block>

        <Block id="cs-thinking" title="The thinking">
          <p className="text-pretty">{cs.thinking.intro}</p>
          <blockquote className="border-t border-b border-t-ink border-b-line py-7 font-display text-[30px] leading-[1.15] font-bold tracking-[-0.025em] text-pretty">
            “{cs.thinking.quote}”
          </blockquote>
          <ol className="border-t border-line text-base">
            {cs.thinking.decisions.map((d, i) => (
              <li key={i} className="flex gap-5 border-b border-line py-[18px]">
                <span className="pt-[3px] font-mono text-[13px] text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </Block>

        <section aria-labelledby="cs-built" className="flex flex-col gap-10">
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <h2 id="cs-built" className="flex-[1_1_300px] font-display text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em]">
              What I built
            </h2>
            <p className="max-w-[760px] flex-[999_1_560px] text-[19px] leading-[1.6] text-pretty">{cs.built.intro}</p>
          </div>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {cs.built.mobileShots.map((caption, i) => (
              <figure key={i} className="flex flex-col gap-3">
                <Placeholder label="[Mobile screen]" className="aspect-[9/16]" />
                <figcaption className="meta text-muted-foreground">{caption}</figcaption>
              </figure>
            ))}
          </div>
          <figure className="flex flex-col gap-3">
            <Placeholder label="[Web dashboard screenshot]" className="aspect-video" />
            <figcaption className="meta text-muted-foreground">{cs.built.webShot}</figcaption>
          </figure>
        </section>

        <Block id="cs-outcome" title="Outcome & lessons">
          <p className="text-pretty">{cs.outcome}</p>
        </Block>
      </article>

      <section aria-label="Next case study" className="container-x py-30">
        <Link
          href={`/labs/${next.slug}`}
          className="flex flex-wrap items-center justify-between gap-6 bg-invert p-[clamp(28px,4vw,56px)] text-invert-ink no-underline transition-colors hover:bg-accent hover:text-on-accent"
        >
          <div className="flex flex-col gap-2.5">
            <span className="meta text-[13px] opacity-75">Next case study</span>
            <span className="font-display text-[clamp(36px,5vw,72px)] leading-[0.9] font-black tracking-[-0.04em] uppercase">
              {next.name}
            </span>
          </div>
          <ArrowRight size={56} />
        </Link>
      </section>

      <ExploreCards items={["labs", "changelog", "sideQuests"]} labels={{ labs: "More case studies" }} />
    </main>
  );
}
