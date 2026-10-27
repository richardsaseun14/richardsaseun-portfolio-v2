import type { Status } from "./types";

/** Responses slower than this count as degraded. */
export const SLOW_MS = 1500;

export function classifyResponse({ ok, latencyMs }: { ok: boolean; latencyMs: number }): Status {
  if (!ok) return "down";
  return latencyMs > SLOW_MS ? "degraded" : "operational";
}

/** Maps an Atlassian Statuspage `status.indicator` to our status. */
export function classifyIndicator(indicator: string): Status {
  if (indicator === "none") return "operational";
  if (indicator === "major" || indicator === "critical") return "down";
  return "degraded";
}

const SEVERITY: Record<Status, number> = { unconfigured: 0, operational: 1, degraded: 2, down: 3 };

/** Worst status among configured services; "unconfigured" only when nothing is configured. */
export function overallStatus(results: { status: Status }[]): Status {
  return results.reduce<Status>(
    (worst, { status }) => (SEVERITY[status] > SEVERITY[worst] ? status : worst),
    "unconfigured",
  );
}
