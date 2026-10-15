"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { nav } from "@/lib/content";
import { isActive } from "@/lib/utils";
import { Wordmark } from "./Wordmark";
import { Availability, LagosTime, SoundToggle, ThemeSwitch } from "./HeaderControls";
import { ArrowRight, Close, Menu } from "./Icons";

const links = [{ label: "Home", href: "/" }, ...nav];
const squareBtn = "grid size-11 cursor-pointer place-items-center border border-line text-ink hover:border-ink";

/** Full-screen navigation overlay for small screens. Hidden from `md` up. */
export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close whenever the route changes (back/forward included).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Open menu" className={`${squareBtn} md:hidden`}>
        <Menu />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="mobile-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg text-ink md:hidden"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="container-x flex items-center justify-between gap-4 border-b border-line py-[18px]">
            <Wordmark />
            <Dialog.Close aria-label="Close menu" className={squareBtn}>
              <Close size={18} />
            </Dialog.Close>
          </div>

          <nav aria-label="Primary" className="container-x pt-6">
            <ul className="border-t border-ink">
              {links.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between gap-4 py-5 font-display text-[clamp(30px,9vw,64px)] leading-[0.95] font-black tracking-[-0.04em] uppercase no-underline ${
                        active ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.label}
                      <ArrowRight size={28} className="shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-x mt-auto flex flex-col gap-4 border-t border-line py-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <LagosTime className="px-0" />
              <Availability />
            </div>
            <div className="flex items-center gap-2.5">
              <SoundToggle />
              <ThemeSwitch />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
