// All site copy lives here. Edit this file to update the portfolio.
// Anything in [brackets] is a placeholder waiting for real content.

export const site = {
  name: "Richard Saseun",
  wordmark: { pre: "r", post: "saseun" },
  email: "[email]",
  location: "Lagos, Nigeria",
  timeZone: "Africa/Lagos",
  tzLabel: "WAT",
  bio: "Product-minded software engineer in Lagos, building for web and mobile with AI in the loop.",
  replyTime: "I reply within 24 hours on weekdays.",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/[handle]" },
    { label: "GitHub", href: "https://github.com/[handle]" },
    { label: "X", href: "https://x.com/[handle]" },
  ],
  cvUrl: "#",
};

export const mailto = `mailto:${site.email}`;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Side quests", href: "/side-quests" },
];

export const marquee = [
  "Writing code",
  "Shipping products",
  "Web & mobile",
  "React Native",
  "Next.js",
  "Vue",
  "Supabase",
  "AI-driven workflows",
  "Product thinking",
  "Leading teams",
  "Breaking code",
  "Fixing code",
  "Open to roles",
];

export const stats = [
  { value: "9+", label: "Years building production software" },
  { value: "15+", label: "Client web apps delivered" },
  { value: "50K+", label: "Users on a product I helped build" },
  // { value: "₦50M", accent: "+", label: "Revenue through a product" },
];

export const principles = [
  {
    title: "Start from the user",
    body: "I ask why before how, and scope features around real usage and business impact, not just the ticket.",
  },
  {
    title: "Ship across every screen",
    body: "Web, mobile and the backend that connects them. I've led front-end teams and can own a feature from start to finish.",
  },
  {
    title: "AI-native workflow",
    body: "I use AI to build faster and build AI into the products themselves, without cutting corners.",
  },
];

export const pipeline = ["Interface", "API", "Database", "Pipeline", "Tests"];

export const stack = [
  { group: "Frontend", items: ["React", "Next.js", "Vue", "JavaScript", "TypeScript", "Tailwind CSS"] },
  { group: "Mobile", items: ["React Native"] },
  { group: "Backend & data", items: ["Node.js", "Python", "Django", "PostgreSQL", "Supabase"] },
  { group: "AI", items: ["OpenAI API", "AI-driven workflows"] },
  { group: "CMS", items: ["WordPress"] },
];

/* ---------- Work ---------- */

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  type: string;
  role: string;
  year: string;
  tags: Array<"Web" | "Mobile" | "AI" | "Open source">;
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

const caseStudyTemplate: CaseStudy = {
  industry: "[Industry]",
  summary:
    "[One sentence: what the product does, for whom, and the result, e.g. “Scaling a [category] platform to 50K+ users.”]",
  timeline: "[Start – End]",
  team: "[Team size & makeup]",
  stack: "[React Native · Next.js · Node · Postgres]",
  links: [
    { label: "Live", href: "#" },
    { label: "App Store", href: "#" },
  ],
  problem: [
    "[What was broken or missing? Who was hurting, and what did it cost the business? Keep it to the essentials.]",
    "[Constraints: timeline, team, legacy systems, regulation, budget.]",
  ],
  thinking: {
    intro: "[How you framed the problem, what you weighed, and the call you made.]",
    quote: "[The key insight or decision, in one line.]",
    decisions: [
      "[Trade-off or decision #1 and why]",
      "[Trade-off or decision #2 and why]",
      "[Trade-off or decision #3 and why]",
    ],
  },
  built: {
    intro: "[Your part, specifically: architecture, the hard features, leading the team, the AI pieces.]",
    mobileShots: ["[Caption]", "[Caption]", "[Caption]"],
    webShot: "[Caption]",
  },
  outcome: "[What shipped, what moved, and what you'd do differently next time.]",
};

export const projects: Project[] = [
  {
    slug: "product-name",
    name: "[Product name]",
    blurb: "[One line on what the product does and who it's for.]",
    type: "Web + Mobile",
    role: "[Your role]",
    year: "[Year]",
    tags: ["Web", "Mobile"],
    featured: true,
    metrics: [
      { value: "50K", accent: "+", label: "Active users" },
      // { value: "₦50M", accent: "+", label: "Revenue" },
      { value: "[X]", accent: "%", label: "[Another metric]" },
    ],
    caseStudy: caseStudyTemplate,
  },
  {
    slug: "project-two",
    name: "[Project name]",
    blurb: "[What you built and the outcome, in one line.]",
    type: "Mobile",
    role: "[Role]",
    year: "[Year]",
    tags: ["Mobile"],
    caseStudy: caseStudyTemplate,
  },
  {
    slug: "project-three",
    name: "[Project name]",
    blurb: "[What you built and the outcome, in one line.]",
    type: "Web",
    role: "[Role]",
    year: "[Year]",
    tags: ["Web"],
    caseStudy: caseStudyTemplate,
  },
  {
    slug: "project-four",
    name: "[Project name]",
    blurb: "[AI feature or tool you shipped]",
    type: "AI · Web",
    role: "[Role]",
    year: "[Year]",
    tags: ["AI", "Web"],
    caseStudy: caseStudyTemplate,
  },
  {
    slug: "open-source",
    name: "[Open-source project]",
    blurb: "[What you contributed]",
    type: "Open source",
    role: "[Repo]",
    year: "[Year]",
    tags: ["Open source"],
    caseStudy: caseStudyTemplate,
  },
];

export const projectFilters = ["All", "Web", "Mobile", "AI", "Open source"] as const;

// Side projects: add a new entry to the top of this list for each new build.
export type SideProject = {
  name: string;
  blurb: string;
  date: string;
  status: "Live" | "Building" | "Archived";
  tags: string[];
  demo?: string;
  code?: string;
};

export const sideProjects: SideProject[] = [
  { name: "[Side project]", blurb: "[One line: what it does and why you built it]", date: "[Mon 2026]", status: "Building", tags: ["AI", "Next.js"], demo: "#", code: "#" },
  { name: "[Side project]", blurb: "[One line: what it does and why you built it]", date: "[Mon 2026]", status: "Live", tags: ["React Native"], demo: "#", code: "#" },
  { name: "[Side project]", blurb: "[One line: what it does and why you built it]", date: "[Mon 2026]", status: "Live", tags: ["Supabase", "Vue"], demo: "#", code: "#" },
  { name: "[Side project]", blurb: "[One line: what it does and why you built it]", date: "[Mon 2025]", status: "Live", tags: ["Python"], demo: "#", code: "#" },
  { name: "[Side project]", blurb: "[One line: what it does and why you built it]", date: "[Mon 2025]", status: "Archived", tags: ["Node.js"], code: "#" },
];

/* ---------- About ---------- */

export const experience = [
  { period: "[20XX] – Now", current: true, company: "[Company]", role: "[Role]", notes: ["[What you shipped and what it moved]", "[What you shipped and what it moved]"] },
  { period: "[20XX] – [20XX]", company: "[Company]", role: "Front-end Lead", notes: ["Led the front-end team on [product], used by 50K+ people", "[What you shipped and what it moved]"] },
  { period: "[20XX] – [20XX]", company: "[Company / Freelance]", role: "[Role]", notes: ["Delivered 15+ client web apps across [industries]"] },
  { period: "2017 – [20XX]", company: "[Company]", role: "[Role]", notes: ["[What you shipped and what it moved]"] },
];

export const capabilities = [
  { title: "Mobile apps", body: "Cross-platform iOS and Android apps with React Native." },
  { title: "Web applications", body: "Fast, accessible apps with Next.js, Vue and Tailwind." },
  { title: "Front-end architecture", body: "Codebases, patterns and design systems a team can grow into." },
  { title: "AI-powered features", body: "LLM features with OpenAI, from prototype to production." },
  { title: "Design to production", body: "Taking designs all the way to a polished, shipped product." },
  { title: "MVPs", body: "From zero to launch, fast, without boxing in what comes next." },
  { title: "Enterprise & large systems", body: "Complex domains, many users and long-lived codebases." },
];

export const quickFacts = [
  { label: "Role", value: "Full-stack engineer, web & mobile" },
  { label: "Experience", value: "9+ years of production software" },
  { label: "Leadership", value: "Led front-end teams" },
  { label: "Delivered", value: "15+ client web apps" },
  { label: "Scale", value: "50K+ users and ₦50M+ revenue on one product" },
  { label: "Core stack", value: "React, Vue, Next.js, React Native, Node, Python / Django, Postgres" },
  { label: "Also", value: "Open-source contributor · AI-driven workflows" },
  { label: "Education", value: "[Degree] · [School]" },
];

/* ---------- Side quests ---------- */

export const roots = [
  { key: "faith", label: "Faith", title: "Christian", body: "A practicing Christian. It sits at the centre of who I am." },
  { key: "roots", label: "Roots", title: "Yoruba · Nigerian", body: "Yoruba by heritage, proudly Nigerian, building from Lagos." },
  { key: "family", label: "Family", title: "Married", body: "[A line about family, if you'd like one.]" },
] as const;

export type Watch = { title: string; meta: string; progress: number; status?: "Watching" | "Up next"; poster?: string };

export const series: Watch[] = [
  { title: "[Series title]", meta: "S[0] · E[0] · [Platform]", progress: 60 },
  { title: "[Series title]", meta: "S[0] · E[0] · [Platform]", progress: 25 },
  { title: "[Series title]", meta: "S[0] · E[0] · [Platform]", progress: 80 },
  { title: "[Series title]", meta: "S[0] · E[0] · [Platform]", progress: 10 },
  { title: "[Series title]", meta: "Up next", progress: 0 },
  { title: "[Series title]", meta: "Up next", progress: 0 },
];

export const anime: Watch[] = [
  { title: "[Anime title]", meta: "Ep [8] of [24]", progress: 33, status: "Watching" },
  { title: "[Anime title]", meta: "Ep [3] of [12]", progress: 25, status: "Watching" },
  { title: "[Anime title]", meta: "Ep [20] of [25]", progress: 80, status: "Watching" },
  { title: "[Anime title]", meta: "Not started", progress: 0, status: "Up next" },
  { title: "[Anime title]", meta: "Not started", progress: 0, status: "Up next" },
];

export const music = {
  title: "[Album or playlist]",
  artist: "[Artist]",
  note: "[One line on why it's on repeat.]",
  listenLabel: "Listen on [Spotify]",
  listenHref: "#",
  playlistsHref: "#",
  cover: undefined as string | undefined,
};

export const books = {
  current: {
    title: "[Book title]",
    author: "[Author]",
    note: "[One line on why you picked it up or what's sticking with you.]",
    page: 120,
    pages: 320,
  },
  finished: [
    { title: "[Book title]", author: "[Author]" },
    { title: "[Book title]", author: "[Author]" },
    { title: "[Book title]", author: "[Author]" },
  ],
  listHref: "#",
};

export type Game = { title: string; meta: string; status: "Playing" | "Finished"; cover?: string };

export const games: Game[] = [
  { title: "[Game title]", meta: "[Platform] · [Hours]h", status: "Playing" },
  { title: "[Game title]", meta: "[Platform] · [Hours]h", status: "Playing" },
  { title: "[Game title]", meta: "[Platform] · [Hours]h", status: "Playing" },
  { title: "[Game title]", meta: "[Platform] · Finished [Year]", status: "Finished" },
  { title: "[Game title]", meta: "[Platform] · Finished [Year]", status: "Finished" },
  { title: "[Game title]", meta: "[Platform] · Finished [Year]", status: "Finished" },
  { title: "[Game title]", meta: "[Platform] · Finished [Year]", status: "Finished" },
];

export const learning = {
  title: "AI engineering",
  body: "Going deep on artificial intelligence: how the models work, and how to engineer real products on top of them.",
  facts: [
    { label: "Focus", value: "AI engineering" },
    { label: "Learning from", value: "[Course / book]" },
    { label: "Building", value: "[Side project]" },
  ],
};

/* ---------- Cross-page links ---------- */

export const explore = {
  work: { href: "/work", title: "Work", label: "Case studies & builds" },
  about: { href: "/about", title: "About", label: "Experience & quick facts" },
  sideQuests: { href: "/side-quests", title: "Side quests", label: "Music, screens & off-hours" },
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
