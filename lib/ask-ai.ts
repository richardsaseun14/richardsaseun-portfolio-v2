export type AskAiProvider = "chatgpt" | "claude";

export type AskAiConfig = {
  enabled?: boolean;
  prompt?: string;
  siteUrl?: string;
};

const endpoints: Record<AskAiProvider, string> = {
  chatgpt: "https://chatgpt.com/?q=",
  claude: "https://claude.ai/new?q=",
};

/** Returns no link until the feature has a prompt and a valid public-site URL. */
export function buildAskAiUrl(provider: AskAiProvider, config: AskAiConfig): string | null {
  const prompt = config.prompt?.trim();
  const siteUrl = config.siteUrl?.trim();
  if (!config.enabled || !prompt || !siteUrl) return null;

  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;
  } catch {
    return null;
  }

  return endpoints[provider] + encodeURIComponent(prompt.replaceAll("{siteUrl}", siteUrl));
}
