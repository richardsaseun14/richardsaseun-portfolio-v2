"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PREF_KEYS as KEYS } from "@/lib/prefs";

export type ThemeMode = "light" | "dark" | "auto";

type Prefs = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  sound: boolean;
  toggleSound: () => void;
  sparkle: () => void;
  tip: boolean;
  closeTip: () => void;
  panel: boolean;
  openPanel: () => void;
  closePanel: () => void;
};

const PrefsContext = createContext<Prefs | null>(null);

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: ignore */
  }
}

function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

function isEditable(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/* ---------- Tiny Web Audio synth (no audio files) ---------- */
function useSynth() {
  const ctxRef = useRef<AudioContext | null>(null);

  const tone = useCallback(
    (freq: number, at = 0, dur = 0.2, opts: { type?: OscillatorType; vol?: number; to?: number } = {}) => {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctxRef.current ??= new AC();
      const ac = ctxRef.current;
      if (ac.state === "suspended") void ac.resume();
      const t = ac.currentTime + at;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = opts.type ?? "sine";
      osc.frequency.setValueAtTime(freq, t);
      if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(opts.vol ?? 0.05, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    [],
  );

  return useMemo(
    () => ({
      // Confirmation when sound is switched on.
      blip: () => tone(660, 0, 0.18, { vol: 0.08, to: 990 }),
      // Soft two-note chime for clicks.
      chime: () => {
        tone(1046.5, 0, 0.22, { vol: 0.045 });
        tone(1568, 0.045, 0.26, { vol: 0.03 });
      },
      // Gentle rising arpeggio for the portrait reveal.
      sparkle: () =>
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.055, 0.32, { type: "triangle", vol: 0.035 })),
    }),
    [tone],
  );
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [sound, setSound] = useState(false);
  const [tip, setTip] = useState(false);
  const [panel, setPanel] = useState(false);
  const soundRef = useRef(sound);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synth = useSynth();

  // Restore saved preferences.
  useEffect(() => {
    const savedMode = read(KEYS.theme) as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark" || savedMode === "auto") setModeState(savedMode);
    if (read(KEYS.sound) === "1") setSound(true);
  }, []);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  // Apply theme, and follow the system while in Auto.
  useEffect(() => {
    applyTheme(mode);
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  // Show the shortcuts tip once ever, on first use of sound or theme.
  const hint = useCallback(() => {
    if (read(KEYS.tip) === "1") return;
    write(KEYS.tip, "1");
    if (window.matchMedia("(hover: none)").matches) return;
    setTip(true);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTip(false), 6000);
  }, []);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      write(KEYS.theme, m);
      hint();
    },
    [hint],
  );

  const toggleSound = useCallback(() => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    write(KEYS.sound, next ? "1" : "0");
    if (next) synth.blip();
    hint();
  }, [hint, synth]);

  const closeTip = useCallback(() => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTip(false);
  }, []);
  const openPanel = useCallback(() => {
    closeTip();
    setPanel(true);
  }, [closeTip]);
  const closePanel = useCallback(() => setPanel(false), []);

  const sparkle = useCallback(() => {
    if (soundRef.current) synth.sparkle();
  }, [synth]);

  // Click chime on every button and link while sound is on.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!soundRef.current) return;
      const el = (e.target as HTMLElement | null)?.closest?.("button, a");
      if (!el || el.hasAttribute("data-sound-toggle")) return;
      synth.chime();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [synth]);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      switch (e.key) {
        case "t":
        case "T":
          window.scrollTo({ top: 0, behavior });
          break;
        case "b":
        case "B":
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
          break;
        case "s":
        case "S":
          toggleSound();
          break;
        case "l":
        case "L":
          setMode("light");
          break;
        case "d":
        case "D":
          setMode("dark");
          break;
        case "a":
        case "A":
          setMode("auto");
          break;
        case "?":
          openPanel();
          break;
        case "Escape":
          closePanel();
          closeTip();
          return;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSound, setMode, openPanel, closePanel, closeTip]);

  useEffect(() => () => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
  }, []);

  const value = useMemo<Prefs>(
    () => ({ mode, setMode, sound, toggleSound, sparkle, tip, closeTip, panel, openPanel, closePanel }),
    [mode, setMode, sound, toggleSound, sparkle, tip, closeTip, panel, openPanel, closePanel],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}
