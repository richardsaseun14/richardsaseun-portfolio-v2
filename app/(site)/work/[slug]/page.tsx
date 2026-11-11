import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExploreCards } from "@/components/ExploreCards";
import { ArrowLeft } from "@/components/Icons";
import { ChapterIndex } from "@/components/case-study/ChapterIndex";
import { Media } from "@/components/case-study/Media";
import { ProjectNav } from "@/components/case-study/ProjectNav";
import { Stat, Stats } from "@/components/case-study/Stats";
import { site } from "@/lib/content";
import { getProjects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";

const bodies = {
  "marys-land-farm": () => import("@/content/case-studies/marys-land-farm.mdx"),
  crewslink: () => import("@/content/case-studies/crewslink.mdx"),
};
type Params = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((project) => project.slug === slug);
  return {
    title: project ? `${project.name} case study` : "Case study",
    description: project?.caseStudy?.summary ?? site.bio,
  };
}
export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const [projects, study] = await Promise.all([getProjects(), getCaseStudy(slug)]);
  const project = projects.find((project) => project.slug === slug);
  const loadBody = bodies[slug as keyof typeof bodies];
  if (!project?.caseStudy || !study || !loadBody) notFound();
  const { default: Body } = await loadBody();
  const { facts, chapters } = study;
  const cs = project.caseStudy;
  const details = [
    ["Role", facts.role ?? project.role],
    ["Scope", facts.scope],
    ["Year", project.year],
    ["Timeline", facts.timeline],
    ["Team", facts.team],
    ["Stack", facts.stack],
    ["Status", facts.status],
  ].filter(([, value]) => value);
  const links = facts.links.length ? facts.links : cs.links;
  return (
    <main>
      <header className="container-x pt-8 sm:pt-12">
        <Link href="/work" className="inline-flex min-h-11 items-center gap-2 meta text-[13px] no-underline">
          <ArrowLeft size={16} /> Back to Work
        </Link>
        <p className="mt-8 meta text-muted-foreground">
          {[project.type, cs.industry, project.year].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-4 page-title [overflow-wrap:anywhere]">
          {project.name}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[740px] text-[19px] leading-relaxed sm:text-[22px]">{cs.summary}</p>
        <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="meta text-muted-foreground">{label}</dt>
              <dd className="mt-2 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6 meta">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </header>
      <div className="container-x pt-10 sm:pt-14">
        <Media src={cs.heroImage} alt={`${project.name} interface`} priority />
        {facts.stats.length > 0 && (
          <div className="mt-8">
            <Stats>
              {facts.stats.map((stat) => (
                <Stat key={stat.label} {...stat} />
              ))}
            </Stats>
          </div>
        )}
      </div>
      <div className="container-x pt-16 sm:pt-24">
        <div className="cs-layout">
          <ChapterIndex chapters={chapters} />
          <article className="cs-body min-w-0">
            <Body />
          </article>
        </div>
      </div>
      <ProjectNav projects={projects} slug={slug} />
      <ExploreCards items={["work", "about", "afterHours"]} labels={{ work: "More case studies" }} />
    </main>
  );
}
