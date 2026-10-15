"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/content";
import { isActive } from "@/lib/utils";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { Availability, LagosTime, SoundToggle, ThemeSwitch, Tip } from "./HeaderControls";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line">
      <div className="container-x flex items-center justify-between gap-4 py-[18px]">
        <Wordmark />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 font-mono text-[13px] uppercase tracking-[0.04em] md:flex"
        >
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "underline decoration-accent decoration-2 underline-offset-[6px]"
                    : "no-underline"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop controls */}
        <div className="hidden items-center gap-2.5 md:flex">
          <LagosTime className="hidden xl:flex" />
          <Availability className="hidden lg:flex" />
          <span className="hk">
            <SoundToggle />
            <Tip>Sound · S</Tip>
          </span>
          <span className="hk">
            <ThemeSwitch />
            <Tip>Theme · L / D / A</Tip>
          </span>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2.5 md:hidden">
          <SoundToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
