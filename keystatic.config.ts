import { config } from "@keystatic/core";
import { about } from "./keystatic/schema/about";
import { home } from "./keystatic/schema/home";
import { profile } from "./keystatic/schema/profile";
import { projects } from "./keystatic/schema/projects";
import { sideProjects } from "./keystatic/schema/side-projects";
import { sideQuests } from "./keystatic/schema/side-quests";

// Local mode edits files on disk during `npm run dev`.
// GitHub mode (production) commits edits to the repo, which triggers a redeploy.
const useGitHub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

export default config({
  storage: useGitHub
    ? { kind: "github", repo: "richardsaseun14/richardsaseun-portfolio-v2" }
    : { kind: "local" },
  ui: {
    brand: { name: "Portfolio" },
    navigation: {
      Pages: ["profile", "home", "about", "sideQuests"],
      Work: ["projects", "sideProjects"],
    },
  },
  singletons: { profile, home, about, sideQuests, sideProjects },
  collections: { projects },
});
