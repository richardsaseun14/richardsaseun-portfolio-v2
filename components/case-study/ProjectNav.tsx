import Link from "next/link";
import type { Project } from "@/lib/content";
export function ProjectNav({ projects, slug }: { projects: Project[]; slug: string }) {
  if (projects.length < 2) return null;
  const index = projects.findIndex((project) => project.slug === slug);
  const neighbors = [
    {
      label: "Previous case study",
      project: projects[(index - 1 + projects.length) % projects.length],
    },
    {
      label: "Next case study",
      project: projects[(index + 1) % projects.length],
    },
  ];
  return (
    <nav aria-label="More case studies" className="container-x grid gap-px py-20 sm:grid-cols-2 sm:py-28">
      {neighbors.map(({ label, project }) => (
        <Link
          key={label}
          href={`/work/${project.slug}`}
          className="flex flex-col gap-5 bg-invert p-8 text-invert-ink no-underline transition-colors hover:bg-accent hover:text-on-accent"
        >
          <span className="meta">
            {label} {label.startsWith("Next") ? "→" : "←"}
          </span>
          <span className="font-display text-[clamp(24px,3vw,42px)] leading-tight font-extrabold tracking-tight">
            {project.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
