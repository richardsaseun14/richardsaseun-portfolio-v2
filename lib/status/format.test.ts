import { describe, expect, it } from "vitest";
import { formatAgo, formatLatency } from "./format";

describe("formatAgo", () => {
  it.each([
    [0, "just now"],
    [4_000, "just now"],
    [5_000, "5s ago"],
    [59_000, "59s ago"],
    [60_000, "1m ago"],
    [125_000, "2m ago"],
    [3_600_000, "1h ago"],
  ])("formats %ims as %s", (ms, expected) => {
    expect(formatAgo(ms)).toBe(expected);
  });

  it("treats clock skew (negative) as just now", () => {
    expect(formatAgo(-2_000)).toBe("just now");
  });
});

describe("formatLatency", () => {
  it("rounds to whole milliseconds", () => {
    expect(formatLatency(87.6)).toBe("88 ms");
  });

  it("switches to seconds from 1s", () => {
    expect(formatLatency(1_234)).toBe("1.23 s");
  });

  it("returns a dash when there is no measurement", () => {
    expect(formatLatency(undefined)).toBe("—");
  });
});
