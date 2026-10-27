export type Status = "operational" | "degraded" | "down" | "unconfigured";

export type CheckResult = {
  id: string;
  name: string;
  /** What the service powers on the site. */
  description: string;
  status: Status;
  latencyMs?: number;
  /** HTTP status code of the failing response, if any. */
  code?: number;
};

export type StatusReport = { checkedAt: string; overall: Status; results: CheckResult[] };
