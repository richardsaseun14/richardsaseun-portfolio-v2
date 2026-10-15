import Link from "next/link";
import { site } from "@/lib/content";

export function Wordmark() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center text-ink no-underline hover:text-ink" aria-label={`${site.name}, home`}>
      <span className="font-display text-[20px] leading-none font-extrabold tracking-[-0.03em]">
        {site.wordmark.pre}
        <span className="text-accent">.</span>
        {site.wordmark.post}
      </span>
    </Link>
  );
}
