"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { formatAgo } from "@/lib/status/format";

/** "Checked 12s ago" that counts up, plus a manual refresh. Re-fetches the report every `everyMs`. */
export function StatusRefresh({ checkedAt, everyMs }: { checkedAt: string; everyMs: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => startTransition(() => router.refresh()), everyMs);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [router, everyMs]);

  const ago = now === null ? "just now" : formatAgo(now - Date.parse(checkedAt));

  return (
    <div className="meta flex items-center gap-3 opacity-80">
      <time dateTime={checkedAt} aria-live="polite">
        Checked {ago}
      </time>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={pending}
        aria-label="Refresh status"
        className="inline-grid size-8 cursor-pointer place-items-center border border-[rgba(128,128,128,0.5)] transition-colors hover:border-current disabled:cursor-wait"
      >
        <RotateCw className={`size-3.5 ${pending ? "motion-safe:animate-spin" : ""}`} />
      </button>
    </div>
  );
}
