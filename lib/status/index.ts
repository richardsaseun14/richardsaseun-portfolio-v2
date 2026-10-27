import "server-only";
import { unstable_cache } from "next/cache";
import { checks, type Check } from "./checks";
import { classifyResponse, overallStatus } from "./classify";
import type { CheckResult, Status, StatusReport } from "./types";

export const TIMEOUT_MS = 5000;
export const REVALIDATE = 60;

const worse = (a: Status, b: Status): Status => overallStatus([{ status: a }, { status: b }]);

async function runCheck({ probe, ...info }: Check): Promise<CheckResult> {
  const started = performance.now();
  try {
    const result = await probe(AbortSignal.timeout(TIMEOUT_MS));
    if (!result) return { ...info, status: "unconfigured" };
    const latencyMs = Math.round(performance.now() - started);
    const measured = classifyResponse({ ok: result.ok, latencyMs });
    const status = result.reported ? worse(measured, result.reported) : measured;
    return { ...info, status, latencyMs, code: result.code };
  } catch (err) {
    // Name only: messages from upstream libraries can echo request details.
    console.error(`Status check "${info.id}" failed: ${err instanceof Error ? err.name : "unknown error"}`);
    return { ...info, status: "down" };
  }
}

async function buildReport(): Promise<StatusReport> {
  const results = await Promise.all(checks.map(runCheck));
  return { checkedAt: new Date().toISOString(), overall: overallStatus(results), results };
}

/** Cached for a minute so visitors can't hammer the upstream APIs. */
export const getStatusReport = unstable_cache(buildReport, ["status-report"], { revalidate: REVALIDATE });
