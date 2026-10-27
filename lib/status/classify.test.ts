import { describe, expect, it } from "vitest";
import { classifyIndicator, classifyResponse, overallStatus, SLOW_MS } from "./classify";
import type { Status } from "./types";

describe("classifyResponse", () => {
  it("is operational when OK and fast", () => {
    expect(classifyResponse({ ok: true, latencyMs: 120 })).toBe("operational");
  });

  it("is degraded when OK but slow", () => {
    expect(classifyResponse({ ok: true, latencyMs: SLOW_MS + 1 })).toBe("degraded");
  });

  it("is down when the response is not OK", () => {
    expect(classifyResponse({ ok: false, latencyMs: 80 })).toBe("down");
  });
});

describe("classifyIndicator", () => {
  it.each([
    ["none", "operational"],
    ["minor", "degraded"],
    ["maintenance", "degraded"],
    ["major", "down"],
    ["critical", "down"],
  ] as const)("maps %s to %s", (indicator, expected) => {
    expect(classifyIndicator(indicator)).toBe(expected);
  });

  it("treats an unknown indicator as degraded", () => {
    expect(classifyIndicator("something-new")).toBe("degraded");
  });
});

describe("overallStatus", () => {
  const of = (...statuses: Status[]) => statuses.map((status) => ({ status }));

  it("is operational when every configured service is", () => {
    expect(overallStatus(of("operational", "operational"))).toBe("operational");
  });

  it("ignores unconfigured services", () => {
    expect(overallStatus(of("operational", "unconfigured"))).toBe("operational");
  });

  it("takes the worst configured status", () => {
    expect(overallStatus(of("operational", "degraded"))).toBe("degraded");
    expect(overallStatus(of("degraded", "down", "operational"))).toBe("down");
  });

  it("is unconfigured when nothing is configured", () => {
    expect(overallStatus(of("unconfigured", "unconfigured"))).toBe("unconfigured");
    expect(overallStatus([])).toBe("unconfigured");
  });
});
