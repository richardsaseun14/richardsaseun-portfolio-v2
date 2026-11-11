import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ChapterEntry = { id: string; number: string; title: string };
export type StudyFacts = {
  role?: string;
  team?: string;
  scope?: string;
  stack?: string;
  timeline?: string;
  status?: string;
  links: { label: string; href: string }[];
  stats: { value: string; label: string; source?: string }[];
};

export function parseCaseStudy(source: string) {
  const { data, content } = matter(source);
  const chapters = [...content.matchAll(/<Chapter\s+id="([^"]+)"\s+number="([^"]+)"\s+title="([^"]+)"/g)].map(
    ([, id, number, title]) => ({ id, number, title }),
  );
  if (new Set(chapters.map((chapter) => chapter.id)).size !== chapters.length)
    throw new Error("Duplicate chapter anchor");
  return {
    facts: {
      ...data,
      links: data.links ?? [],
      stats: data.stats ?? [],
    } as StudyFacts,
    chapters,
  };
}

export async function getCaseStudy(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    return parseCaseStudy(await readFile(path.join(process.cwd(), "content/case-studies", `${slug}.mdx`), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
