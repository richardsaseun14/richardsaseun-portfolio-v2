import { describe, expect, it } from "vitest";
import { getCaseStudy, parseCaseStudy } from "./case-studies";

describe("case study authoring", () => {
  it("parses frontmatter and derives the chapter index from MDX", () => {
    const result = parseCaseStudy(
      '---\nrole: Engineer\nteam: Solo\nstats:\n  - value: TODO\n    label: Latency\n---\n<Chapter id="brief" number="01" title="The brief">Text</Chapter>',
    );
    expect(result.facts.role).toBe("Engineer");
    expect(result.facts.stats[0].label).toBe("Latency");
    expect(result.chapters).toEqual([
      { id: "brief", number: "01", title: "The brief" },
    ]);
  });
  it("defaults missing optional fields", () => {
    expect(parseCaseStudy("Some text").facts).toEqual({ links: [], stats: [] });
  });
  it("returns null for unknown or unsafe slugs", async () => {
    expect(await getCaseStudy("unknown-project")).toBeNull();
    expect(await getCaseStudy("../profile")).toBeNull();
  });
  it("rejects duplicate chapter anchors", () => {
    expect(() =>
      parseCaseStudy(
        '<Chapter id="a" number="01" title="A" />\n<Chapter id="a" number="02" title="B" />',
      ),
    ).toThrow("Duplicate");
  });
});
