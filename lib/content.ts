// Editable copy lives in /content as JSON, managed through Keystatic at /keystatic.
// This module re-exports it with the types the components expect, plus the
// site chrome (nav, shortcuts, cross-links) that stays in code.
import aboutData from "@/content/about.json";
import homeData from "@/content/home.json";
import profileData from "@/content/profile.json";
import sideProjectsData from "@/content/side-projects.json";
import afterHoursData from "@/content/after-hours.json";

const orUndefined = <T,>(value: T | null | ""): T | undefined =>
  value === null || value === "" ? undefined : value;

export const site = {
  ...profileData,
  wordmark: { pre: "r", post: "saseun" },
  timeZone: "Africa/Lagos",
  tzLabel: "WAT",
};

export const mailto = `mailto:${site.email}`;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "After hours", href: "/after-hours" },
];

/* ---------- Home ---------- */

export const { marquee, principles, pipeline, stack } = homeData;

export const stats = homeData.stats.map((s) => ({ ...s, accent: orUndefined(s.accent) }));

/* ---------- Work ---------- */

export type ProjectTag = "Web" | "Mobile" | "AI" | "Open source";

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  type: string;
  role: string;
  year: string;
  tags: ProjectTag[];
  featured?: boolean;
  metrics?: { value: string; accent?: string; label: string }[];
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  industry: string;
  summary: string;
  timeline: string;
  team: string;
  stack: string;
  links: { label: string; href: string }[];
  problem: string[];
  thinking: { intro: string; quote: string; decisions: string[] };
  built: { intro: string; mobileShots: string[]; webShot: string };
  outcome: string;
};

export const projectFilters = ["All", "Web", "Mobile", "AI", "Open source"] as const;

export type SideProject = {
  name: string;
  blurb: string;
  date: string;
  status: "Live" | "Building" | "Archived";
  tags: string[];
  demo?: string;
  code?: string;
};

export const sideProjects: SideProject[] = sideProjectsData.items.map((p) => ({
  ...p,
  status: p.status as SideProject["status"],
  demo: orUndefined(p.demo),
  code: orUndefined(p.code),
}));

/* ---------- About ---------- */

export const experience = aboutData.experience.map((e) => ({ ...e, current: e.current || undefined }));

export const { capabilities, quickFacts, learning } = aboutData;

export const aboutIntro = aboutData.intro.split(/\n\s*\n/);

export type RootKey = "faith" | "roots" | "family";

export const roots = aboutData.roots.map((r) => ({ ...r, key: r.key as RootKey }));

/* ---------- After hours ---------- */

// Keystatic drops empty text fields from the JSON, so `note` may be missing.
const musicData: typeof afterHoursData.music & { note?: string } = afterHoursData.music;

export const music = {
  ...musicData,
  note: orUndefined<string>(musicData.note ?? null),
  cover: orUndefined<string>(musicData.cover),
};

export const books = afterHoursData.books;

export type Game = { title: string; meta: string; status: "Playing" | "Finished"; cover?: string };

export const games: Game[] = afterHoursData.games.map((g) => ({
  title: g.title,
  meta: g.meta,
  status: g.status as Game["status"],
  cover: orUndefined<string>(g.cover),
}));

/* ---------- Cross-page links ---------- */

export const explore = {
  work: { href: "/work", title: "Work", label: "Case studies & builds" },
  about: { href: "/about", title: "About", label: "Who I am & where I've worked" },
  afterHours: { href: "/after-hours", title: "After hours", label: "Music, screens & books" },
};

export const shortcuts = [
  { key: "T", action: "Scroll to top" },
  { key: "B", action: "Scroll to bottom" },
  { key: "S", action: "Sound on / off" },
  { key: "L", action: "Light mode" },
  { key: "D", action: "Dark mode" },
  { key: "A", action: "Auto (match your system)" },
  { key: "?", action: "Show shortcuts" },
  { key: "Esc", action: "Close this panel" },
];
