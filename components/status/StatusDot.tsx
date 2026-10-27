import type { Status } from "@/lib/status/types";

export const STATUS_LABEL: Record<Status, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Outage",
  unconfigured: "Not configured",
};

const COLOR: Record<Status, string> = {
  operational: "bg-live",
  degraded: "bg-warn",
  down: "bg-danger",
  unconfigured: "bg-line",
};

/** Coloured dot; pulses while operational. */
export function StatusDot({ status, size = "size-2.5" }: { status: Status; size?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 ${size}`} aria-hidden>
      {status === "operational" && (
        <span className={`absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping ${COLOR[status]}`} />
      )}
      <span className={`relative inline-flex rounded-full ${size} ${COLOR[status]}`} />
    </span>
  );
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className="meta inline-flex sm:min-w-[148px] items-center gap-2 border border-line px-3 py-1.5 text-ink">
      <StatusDot status={status} size="size-2" />
      {STATUS_LABEL[status]}
    </span>
  );
}
