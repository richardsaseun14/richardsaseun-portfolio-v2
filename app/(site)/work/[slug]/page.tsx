import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExploreCards } from "@/components/ExploreCards";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { site, type CaseStudy } from "@/lib/content";
import { getProjects } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project ? `${project.name} case study` : "Case study",
    description: project?.caseStudy?.summary ?? site.bio,
  };
}

type Section = { label: string; title: string; body: string; image?: string | null; caption?: string };

/** Uses the CMS sections when present, otherwise builds them from the older problem / thinking / built fields. */
function toSections(cs: CaseStudy): Section[] {
  if (cs.sections && cs.sections.length > 0) {
    return cs.sections.map((s) => ({
      label: s.label,
      title: s.title,
      body: s.body,
      image: s.images?.[0]?.image,
      caption: s.images?.[0]?.caption,
    }));
  }
  const shot = cs.built.screenshots?.[0];
  return [
    { label: "The problem", title: cs.problem[0] ?? "", body: cs.problem.slice(1).join("\n\n") },
    { label: "The approach", title: cs.thinking.quote || cs.thinking.intro, body: cs.thinking.quote ? cs.thinking.intro : "" },
    { label: "What I built", title: cs.built.intro, body: "", image: shot?.image, caption: shot?.caption },
  ].filter((s) => s.title);
}

/** Shows the screenshot when one is set, otherwise a plain background until images are added. */
function Media({ src, alt, priority = false }: { src?: string | null; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-line/40">
      {src && <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" />}
    </div>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const cs = project?.caseStudy;
  if (!project || !cs) notFound();
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const sections = toSections(cs);
  const details = [
    { k: "Role", v: project.role },
    { k: "Scope", v: cs.scope },
    { k: "Timeline", v: cs.timeline },
    { k: "Team", v: cs.team },
    { k: "Stack", v: cs.stack },
  ].filter((row) => row.v);

  return (
    <main>
      <header className="container-x pt-8 sm:pt-12">
        <Link href="/work" className="meta inline-flex min-h-11 items-center gap-2 text-[13px] no-underline">
          <ArrowLeft size={16} /> Back to Work
        </Link>
        <p className="meta mt-8 text-muted-foreground">
          {[project.type, cs.industry, project.year].filter(Boolean).join(" · ")}
        </p>
        <h1 className="page-title mt-4">
          {project.name}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[680px] text-[19px] leading-[1.55] text-pretty sm:text-[22px]">{cs.summary}</p>

        <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-line pt-6 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
          {details.map((row) => (
            <div key={row.k} className="flex flex-col gap-1">
              <dt className="meta text-muted-foreground">{row.k}</dt>
              <dd className="font-medium">{row.v}</dd>
            </div>
          ))}
          {cs.links.length > 0 && (
            <div className="flex flex-col gap-1">
              <dt className="meta text-muted-foreground">Links</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
                {cs.links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <section aria-label={`${project.name} preview`} className="container-x pt-12 sm:pt-16">
        <Media src={cs.heroImage} alt={`${project.name} interface`} priority />
      </section>

      {project.metrics && project.metrics.length > 0 && (
        <section aria-label="Outcomes" className="container-x pt-12">
          <div className="grid bg-invert text-invert-ink [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
            {project.metrics.map((m) => (
              <div key={m.label} className="p-6 sm:p-9">
                <div className="font-display text-[clamp(44px,12vw,64px)] leading-none font-extrabold tracking-[-0.04em]">
                  {m.value}
                  <span className="text-accent">{m.accent}</span>
                </div>
                <div className="meta mt-3 opacity-75">{m.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <article className="container-x flex flex-col gap-20 pt-20 sm:gap-28 sm:pt-28">
        {sections.map((section, i) => (
          <section key={`${section.title}-${i}`} aria-labelledby={`cs-${i}`} className="flex flex-col gap-10">
            <div className="flex max-w-[680px] flex-col gap-4">
              <p className="meta text-accent">
                {String(i + 1).padStart(2, "0")} · {section.label}
              </p>
              <h2 id={`cs-${i}`} className="font-display text-[clamp(28px,4vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance">
                {section.title}
              </h2>
              {section.body.split(/\n\s*\n/).filter(Boolean).map((p) => (
                <p key={p} className="text-[17px] leading-[1.7] text-pretty text-muted-foreground sm:text-[18px]">
                  {p}
                </p>
              ))}
            </div>
            <figure className="flex flex-col gap-3">
              <Media src={section.image} alt={section.caption || `${project.name}: ${section.label}`} />
              {section.image && section.caption && <figcaption className="meta text-muted-foreground">{section.caption}</figcaption>}
            </figure>
          </section>
        ))}

        {cs.outcome && (
          <section aria-labelledby="cs-outcome" className="flex max-w-[680px] flex-col gap-4 border-t border-line pt-10">
            <h2 id="cs-outcome" className="font-display text-[clamp(28px,4vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em]">
              Outcome
            </h2>
            <p className="text-[19px] leading-[1.6] text-pretty sm:text-[22px]">{cs.outcome}</p>
          </section>
        )}
      </article>


      {next && <section aria-label="Next case study" className="container-x py-20 sm:py-30">
        <Link
          href={`/work/${next.slug}`}
          className="flex flex-wrap items-center justify-between gap-6 bg-invert p-[clamp(28px,4vw,56px)] text-invert-ink no-underline transition-colors hover:bg-accent hover:text-on-accent"
        >
          <div className="flex flex-col gap-2.5">
            <span className="meta text-[13px] opacity-75">Next case study</span>
            <span className="font-display text-[clamp(32px,5vw,72px)] leading-[0.9] font-black tracking-[-0.04em] uppercase [overflow-wrap:anywhere]">
              {next.name}
            </span>
          </div>
          <ArrowRight size={56} className="size-10 sm:size-14" />
        </Link>
      </section>}

      <ExploreCards items={["work", "about", "afterHours"]} labels={{ work: "More case studies" }} />
    </main>
  );
}
