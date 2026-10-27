import { formatLatency } from "@/lib/status/format";
import type { Status, StatusReport } from "@/lib/status/types";
import { StatusDot, StatusPill } from "./StatusDot";
import { StatusRefresh } from "./StatusRefresh";

const HEADLINE: Record<Status, string> = {
  operational: "All systems operational",
  degraded: "Degraded performance",
  down: "Partial outage",
  unconfigured: "No services configured",
};

export function StatusBoard({ report, refreshMs }: { report: StatusReport; refreshMs: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div
        role="status"
        className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 bg-invert p-[clamp(20px,3.5vw,40px)] text-invert-ink"
      >
        <div className="flex items-center gap-4">
          <StatusDot status={report.overall} size="size-3.5" />
          <span className="font-display text-[clamp(22px,3vw,40px)] leading-none font-extrabold tracking-[-0.035em]">
            {HEADLINE[report.overall]}
            <span className="text-accent">.</span>
          </span>
        </div>
        <StatusRefresh checkedAt={report.checkedAt} everyMs={refreshMs} />
      </div>

      <ul className="divide-y divide-line border border-line">
        {report.results.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:px-7"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-lg font-semibold">{r.name}</span>
              <span className="text-muted-foreground">{r.description}</span>
            </div>
            <span className="meta col-start-1 row-start-2 text-muted-foreground sm:col-start-auto sm:row-start-auto sm:text-right">
              {r.status === "unconfigured" ? "—" : formatLatency(r.latencyMs)}
              {r.code ? ` · HTTP ${r.code}` : ""}
            </span>
            <span className="row-span-2 sm:row-span-1">
              <StatusPill status={r.status} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
