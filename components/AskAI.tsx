import { buildAskAiUrl, type AskAiProvider } from "@/lib/ask-ai";
import { aboutIntro, askAi, capabilities, mailto, site } from "@/lib/content";
import { getProjects } from "@/lib/projects";
import { AskAIBriefing } from "./AskAIBriefing";

const providers = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
] satisfies { id: AskAiProvider; label: string }[];

export async function AskAI() {
  const links = providers.flatMap((provider) => {
    const href = buildAskAiUrl(provider.id, askAi);
    return href ? [{ ...provider, href }] : [];
  });
  if (!links.length) return null;

  const projects = await getProjects();
  return (
    <AskAIBriefing
      links={links}
      briefing={{
        name: site.name,
        bio: site.bio,
        location: site.location,
        projects: projects
          .filter((project) => project.caseStudy)
          .map(({ name, slug, blurb }) => ({ name, href: `/work/${slug}`, blurb })),
        fitIntro: aboutIntro[1] ?? "",
        capabilities,
        contactHref: mailto,
      }}
    />
  );
}
