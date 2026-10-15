"use client";

import { site } from "@/lib/content";
import { usePrefs, type ThemeMode } from "./PrefsProvider";
import { LagosClock } from "./LagosClock";
import { Auto, Clock, Moon, SpeakerOff, SpeakerOn, Sun } from "./Icons";

const modes: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { key: "light", label: "Light mode", Icon: Sun },
  { key: "dark", label: "Dark mode", Icon: Moon },
  { key: "auto", label: "Auto mode (match system)", Icon: Auto },
];

/** Hover hint shown under a control on pointer devices. */
export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="hk-tip pointer-events-none absolute top-[calc(100%+8px)] right-0 z-30 bg-ink px-[9px] py-1.5 font-mono text-[11px] whitespace-nowrap text-bg uppercase tracking-[0.06em]"
    >
      {children}
    </span>
  );
}

export function LagosTime({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-11 items-center gap-2 px-1.5 font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground ${className}`}
    >
      <Clock />
      Lagos <LagosClock className="text-ink" /> {site.tzLabel}
    </span>
  );
}

export function Availability({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-11 items-center gap-2 border border-line px-3.5 font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground ${className}`}
    >
      <span className="size-2 rounded-full bg-live" />
      Open to roles
    </span>
  );
}

export function SoundToggle({ className = "" }: { className?: string }) {
  const { sound, toggleSound } = usePrefs();
  return (
    <button
      type="button"
      data-sound-toggle
      aria-label="Toggle sound"
      aria-pressed={sound}
      onClick={toggleSound}
      className={`grid size-11 cursor-pointer place-items-center border border-line text-ink hover:border-ink ${className}`}
    >
      {sound ? <SpeakerOn /> : <SpeakerOff />}
    </button>
  );
}

export function ThemeSwitch({ className = "" }: { className?: string }) {
  const { mode, setMode } = usePrefs();
  return (
    <span role="group" aria-label="Theme" className={`flex h-11 border border-line ${className}`}>
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
  );
}
