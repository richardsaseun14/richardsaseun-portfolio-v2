"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/content";
import { isActive } from "@/lib/utils";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { Availability, LagosTime, SoundToggle, ThemeSwitch, Tip } from "./HeaderControls";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 isolate border-b border-line">
      {/* Glass layer lives on its own element: backdrop-filter on the header
          would trap the fixed-position MobileMenu inside the header box. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 bg-bg/70 backdrop-blur-md backdrop-saturate-150 transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
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
