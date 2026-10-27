import Link from "next/link";
import { mailto, nav, site } from "@/lib/content";
import { CvFooterLink } from "./CvLinks";
import { Wordmark } from "./Wordmark";
import { LagosClock } from "./LagosClock";
import { ShortcutsButton } from "./Shortcuts";

const colTitle = "meta mb-2.5 font-medium text-muted-foreground";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-12 pt-14 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-x-16 gap-y-10">
          <div className="flex flex-col gap-3.5">
            <Wordmark />
            <p className="max-w-[260px] text-muted-foreground">{site.bio}</p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-10 sm:gap-x-20">
            <nav aria-labelledby="ft-sitemap" className="flex flex-col gap-1.5">
              <h2 id="ft-sitemap" className={colTitle}>Sitemap</h2>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="no-underline">
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav aria-labelledby="ft-social" className="flex flex-col gap-1.5">
              <h2 id="ft-social" className={colTitle}>Elsewhere</h2>
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="no-underline">
                  {s.label} ↗
                </a>
              ))}
              <a href={mailto} className="no-underline">Email ↗</a>
              <CvFooterLink className="no-underline" />
            </nav>
          </div>
        </div>

        <div className="meta flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-muted-foreground">
          <span className="flex flex-wrap items-center gap-5">
            <span>© {new Date().getFullYear()} {site.name} · Built in Lagos</span>
            <Link href="/status" className="inline-flex min-h-8 items-center text-ink no-underline">
              Status
            </Link>
            <ShortcutsButton />
          </span>
          <span>
            Lagos <LagosClock className="text-ink" /> {site.tzLabel}
          </span>
        </div>
      </div>
    </footer>
  );
}
