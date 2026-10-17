"use client";

import { useEffect, useState } from "react";
import { CursorFollower } from "@/components/ui/cursor-follower";

const ENABLE_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Site-wide trailing cursor. Skipped entirely on touch devices and for reduced-motion users. */
export function SiteCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(ENABLE_QUERY);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;

  return <CursorFollower />;
}
