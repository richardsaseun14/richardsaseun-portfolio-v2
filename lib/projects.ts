// Server-only: reads the Projects collection from /content/projects via Keystatic.
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import type { Project, ProjectTag } from "./content";

const reader = createReader(process.cwd(), keystaticConfig);

export async function getProjects(): Promise<Project[]> {
  const entries = await reader.collections.projects.all();
  return [...entries]
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
    .map(({ slug, entry }) => ({
      slug,
      name: entry.name,
      blurb: entry.blurb,
      type: entry.type,
      role: entry.role,
      year: entry.year,
      tags: [...entry.tags] as ProjectTag[],
      featured: entry.featured,
      metrics: entry.metrics.map((m) => ({ value: m.value, accent: m.accent || undefined, label: m.label })),
      caseStudy: {
        ...entry.caseStudy,
        links: [...entry.caseStudy.links],
        problem: [...entry.caseStudy.problem],
        thinking: { ...entry.caseStudy.thinking, decisions: [...entry.caseStudy.thinking.decisions] },
        built: { ...entry.caseStudy.built, mobileShots: [...entry.caseStudy.built.mobileShots] },
      },
    }));
}
