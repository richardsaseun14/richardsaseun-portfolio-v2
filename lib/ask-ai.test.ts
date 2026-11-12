import { describe, expect, it } from "vitest";
import { buildAskAiUrl, type AskAiConfig } from "./ask-ai";
import profile from "@/content/profile.json";

const config: AskAiConfig = {
  enabled: true,
  prompt: "Research {siteUrl}; cite {siteUrl} & explain Richard’s web/mobile work? #hiring + teams",
  siteUrl: "https://portfolio.example",
};

describe("buildAskAiUrl", () => {
  it.each(["chatgpt", "claude"] as const)("includes the editable concise briefing instruction for %s", (provider) => {
    const result = buildAskAiUrl(provider, { ...profile.askAi, siteUrl: profile.siteUrl })!;
    const prompt = new URL(result).searchParams.get("q")!;
    expect(prompt).toContain("no more than 120 words");
    expect(prompt).toContain("up to four short bullets");
    expect(prompt).toContain("avoid generic praise and repetition");
    expect(prompt).toContain(profile.siteUrl);
    expect(prompt).not.toContain("{siteUrl}");
  });
  it.each([
    ["chatgpt", "https://chatgpt.com/"],
    ["claude", "https://claude.ai/new"],
  ] as const)("builds a %s link with the full encoded prompt", (provider, endpoint) => {
    const result = buildAskAiUrl(provider, config)!;
    const url = new URL(result);
    expect(url.origin + url.pathname).toBe(endpoint);
    expect(url.searchParams.get("q")).toBe(
      "Research https://portfolio.example; cite https://portfolio.example & explain Richard’s web/mobile work? #hiring + teams",
    );
    expect([...url.searchParams.keys()]).toEqual(["q"]);
    expect(url.hash).toBe("");
    expect(result).toContain("%20");
  });

  it.each([
    {},
    { ...config, enabled: false },
    { ...config, prompt: undefined },
    { ...config, prompt: "   " },
    { ...config, siteUrl: undefined },
    { ...config, siteUrl: "   " },
    { ...config, siteUrl: "portfolio.example" },
    { ...config, siteUrl: "javascript:alert(1)" },
    { ...config, siteUrl: "https://user:password@portfolio.example" },
  ])("hides links with disabled or incomplete settings: %j", (settings) => {
    expect(buildAskAiUrl("chatgpt", settings)).toBeNull();
    expect(buildAskAiUrl("claude", settings)).toBeNull();
  });

  it("preserves URL punctuation and Unicode through one encoding pass", () => {
    const siteUrl = "https://portfolio.example/about?ref=a&language=日本語#intro";
    const result = buildAskAiUrl("claude", { ...config, prompt: "Visit {siteUrl}", siteUrl })!;
    expect(new URL(result).searchParams.get("q")).toBe(`Visit ${siteUrl}`);
  });

  it("accepts edited prompts without a placeholder and trims surrounding whitespace", () => {
    const result = buildAskAiUrl("chatgpt", { ...config, prompt: "  Tell me about Richard  " })!;
    expect(new URL(result).searchParams.get("q")).toBe("Tell me about Richard");
  });
});
