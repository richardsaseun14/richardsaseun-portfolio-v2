"use client";

import { useEffect, useRef } from "react";
import { shortcuts } from "@/lib/content";
import { usePrefs } from "./PrefsProvider";
import { Close } from "./Icons";

function Kbd({ children, invert = false }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <kbd
      className={
        invert
          ? "mx-0.5 inline-grid h-6 min-w-6 place-items-center border border-white/40 px-1.5 font-mono text-xs"
          : "inline-grid h-7 min-w-7 place-items-center border border-b-2 border-line bg-surface px-2 font-mono text-xs font-medium text-ink normal-case"
      }
    >
      {children}
    </kbd>
  );
}

/** Footer link that opens the shortcuts panel. */
export function ShortcutsButton() {
  const { openPanel } = usePrefs();
  return (
    <button
      type="button"
      onClick={openPanel}
      className="kb-only inline-flex min-h-8 cursor-pointer items-center gap-2 text-ink uppercase"
    >
      Shortcuts <Kbd>?</Kbd>
    </button>
  );
}

/** One-time tip toast + the shortcuts dialog. Mounted once in the root layout. */
export function ShortcutsOverlay() {
  const { tip, closeTip, panel, openPanel, closePanel } = usePrefs();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, [panel]);

  return (
    <>
      {tip && (
        <div
          role="status"
          className="kb-only toast-in fixed right-6 bottom-6 z-40 flex max-w-[calc(100vw-48px)] items-center gap-3 bg-invert py-3 pr-3 pl-[18px] text-[15px] text-invert-ink shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
        >
          <span>
            Tip: press <Kbd invert>?</Kbd> for keyboard shortcuts
          </span>
          <button
            type="button"
            onClick={openPanel}
            className="h-9 cursor-pointer bg-accent px-3.5 text-sm font-semibold text-on-accent"
          >
            Show
          </button>
          <button
            type="button"
            aria-label="Dismiss tip"
            onClick={closeTip}
            className="grid size-9 cursor-pointer place-items-center"
          >
            <Close />
          </button>
        </div>
      )}

      {panel && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6">
          <button
            type="button"
            aria-label="Close shortcuts"
            tabIndex={-1}
            onClick={closePanel}
            className="absolute inset-0 cursor-pointer bg-[rgba(14,14,12,0.55)]"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="kb-title"
            className="relative w-full max-w-[460px] border border-ink bg-bg text-ink shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line py-[18px] pr-5 pl-6">
              <h2 id="kb-title" className="font-display text-xl font-extrabold tracking-[-0.02em]">
                Keyboard shortcuts<span className="text-accent">.</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={closePanel}
                className="grid size-10 cursor-pointer place-items-center border border-line"
              >
                <Close />
              </button>
            </div>
            <ul className="px-6 py-1">
              {shortcuts.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-4 border-b border-line py-[11px]">
                  <span>{s.action}</span>
                  <Kbd>{s.key}</Kbd>
                </li>
              ))}
            </ul>
            <p className="meta px-6 pt-3.5 pb-[18px] text-muted-foreground">Shortcuts pause while you&apos;re typing</p>
          </div>
        </div>
      )}
    </>
  );
}
