"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/content";
import { usePrefs, type ThemeMode } from "./PrefsProvider";
import { Wordmark } from "./Wordmark";
import { LagosClock } from "./LagosClock";
import { Auto, Clock, Moon, SpeakerOff, SpeakerOn, Sun } from "./Icons";

const modes: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { key: "light", label: "Light mode", Icon: Sun },
  { key: "dark", label: "Dark mode", Icon: Moon },
  { key: "auto", label: "Auto mode (match system)", Icon: Auto },
];

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="hk-tip pointer-events-none absolute top-[calc(100%+8px)] right-0 z-30 bg-ink px-[9px] py-1.5 font-mono text-[11px] whitespace-nowrap text-bg uppercase tracking-[0.06em]"
    >
      {children}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { mode, setMode, sound, toggleSound } = usePrefs();

  return (
    <header className="border-b border-line">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-[18px]">
        <Wordmark />

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-7 font-mono text-[13px] uppercase tracking-[0.04em]">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
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

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex h-11 items-center gap-2 px-1.5 font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground">
            <Clock />
            Lagos <LagosClock className="text-ink" /> {site.tzLabel}
          </span>

          <span className="flex h-11 items-center gap-2 border border-line px-3.5 font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground">
            <span className="size-2 rounded-full bg-live" />
            Open to roles
          </span>

          <span className="hk">
            <button
              type="button"
              data-sound-toggle
              aria-label="Toggle sound"
              aria-pressed={sound}
              onClick={toggleSound}
              className="grid size-11 cursor-pointer place-items-center border border-line text-ink hover:border-ink"
            >
              {sound ? <SpeakerOn /> : <SpeakerOff />}
            </button>
            <Tip>Sound · S</Tip>
          </span>

          <span className="hk">
            <span role="group" aria-label="Theme" className="flex h-11 border border-line">
              {modes.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={mode === key}
                  onClick={() => setMode(key)}
                  className={`grid h-[42px] w-10 cursor-pointer place-items-center ${
                    mode === key ? "bg-ink text-bg" : "text-ink hover:bg-surface"
                  }`}
                >
                  <Icon />
                </button>
              ))}
            </span>
            <Tip>Theme · L / D / A</Tip>
          </span>
        </div>
      </div>
    </header>
  );
}
