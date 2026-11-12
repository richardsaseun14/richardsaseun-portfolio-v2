"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import type { AskAiProvider } from "@/lib/ask-ai";
import {
  bonusUnlocked,
  briefingCommands,
  exploreCommand,
  type TerminalBriefing,
  type TerminalCommand,
} from "@/lib/briefing-terminal";
import { AIProviderIcon } from "./AIProviderIcon";
import { ArrowUpRight, Close } from "./Icons";

export type AskAiLink = { id: AskAiProvider; label: string; href: string };

const commandHints = {
  whoami: "The person",
  "ls projects": "The builds",
  "cat team-fit": "The approach",
};

const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function AskAIBriefing({ links, briefing }: { links: AskAiLink[]; briefing: TerminalBriefing }) {
  const [session, setSession] = useState(0);
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) setSession((value) => value + 1);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group flex w-full max-w-[380px] cursor-pointer items-center gap-3 border border-line bg-bg p-3 text-left text-ink transition-colors hover:border-accent data-[state=open]:border-accent sm:w-[340px] ${focusStyle}`}
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center bg-surface font-mono text-lg text-accent"
          >
            &gt;_
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-mono text-[13px] font-semibold">&gt; explore richard</span>
            <span className="text-xs text-muted-foreground">An interactive introduction</span>
          </span>
          <ArrowUpRight size={18} className="text-accent" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[210] bg-black/65 backdrop-blur-sm motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0" />
        <Dialog.Content
          data-theme="dark"
          className="fixed top-1/2 left-1/2 z-[211] grid h-[min(680px,calc(100dvh-32px))] w-[calc(100%-32px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto_auto] border border-line bg-bg text-ink shadow-2xl outline-none [--muted-foreground:var(--muted)] motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:duration-200 motion-safe:data-[state=open]:fade-in-0"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line py-2 pr-2 pl-5 sm:pl-6">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="flex shrink-0 gap-1.5">
                <span className="size-1.5 bg-accent" />
                <span className="size-1.5 bg-accent/50" />
                <span className="size-1.5 bg-accent/25" />
              </span>
              <Dialog.Title className="truncate font-mono text-xs">richard / briefing terminal</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close briefing terminal"
                className={`grid size-11 shrink-0 cursor-pointer place-items-center text-muted-foreground hover:text-ink ${focusStyle}`}
              >
                <Close size={18} />
              </button>
            </Dialog.Close>
          </div>
          <TerminalSession key={session} links={links} briefing={briefing} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Dialog content unmounts on close, so each visit begins with an unexplored dossier. */
function TerminalSession({ links, briefing }: { links: AskAiLink[]; briefing: TerminalBriefing }) {
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<Partial<Record<TerminalCommand, HTMLElement | null>>>({});
  const id = useId();
  const unlocked = bonusUnlocked(history);
  const explored = briefingCommands.filter((command) => history.includes(command)).length;

  const scrollToCommand = (command: TerminalCommand) => {
    const pane = outputRef.current;
    const entry = entryRefs.current[command];
    if (!pane || !entry) return;
    pane.scrollTo({
      top: pane.scrollTop + entry.getBoundingClientRect().top - pane.getBoundingClientRect().top - 20,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const latest = history.at(-1);
    if (latest) scrollToCommand(latest);
  }, [history]);

  const run = (command: TerminalCommand) => {
    const next = exploreCommand(history, command);
    if (next === history) {
      scrollToCommand(command);
      return;
    }
    setHistory(next);
    const summary =
      command === "whoami"
        ? `${briefing.name}. ${briefing.bio} Based in ${briefing.location}.`
        : command === "ls projects"
          ? briefing.projects.length
            ? briefing.projects.map(({ name, blurb }) => `${name}. ${blurb}`).join(" ")
            : "No case studies published yet."
          : command === "cat team-fit"
            ? [briefing.fitIntro, ...briefing.capabilities.map(({ title, body }) => `${title}. ${body}`)].join(" ")
            : "Permission granted. Let’s talk. Contact link available in the terminal.";
    setAnnouncement(
      `${command}. ${summary}${!unlocked && bonusUnlocked(next) ? " All three files explored. Bonus command sudo hire richard unlocked." : ""}`,
    );
  };

  return (
    <>
      <div
        ref={outputRef}
        tabIndex={0}
        role="region"
        aria-label="Terminal output"
        className={`min-h-0 overflow-y-auto overscroll-contain p-5 text-sm leading-relaxed [overflow-wrap:anywhere] sm:p-6 ${focusStyle}`}
      >
        <div className="motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1">
          <p className="mb-4 font-mono text-[10px] text-muted-foreground">
            <span className="text-accent">[ok]</span> portfolio mounted · briefing ready
          </p>
          <p className="font-display text-[clamp(22px,4vw,30px)] leading-[1.1] font-bold tracking-[-0.04em]">
            The person behind
            <br />
            the projects<span className="text-accent">.</span>
          </p>
          <Dialog.Description className="mt-3 max-w-[360px] text-sm text-muted-foreground">
            Pick a command to explore my dossier, or ask an AI assistant for the short version.
          </Dialog.Description>
          <p className="mt-5 flex items-center gap-2 font-mono text-xs text-accent">
            <span aria-hidden="true">&gt;</span> select a command{" "}
            <span aria-hidden="true" className="inline-block h-3.5 w-1.5 bg-accent" />
          </p>
        </div>
        {history.map((command) => (
          <section
            key={command}
            ref={(node) => {
              entryRefs.current[command] = node;
            }}
            aria-labelledby={`${id}-${command.replaceAll(" ", "-")}`}
            className="mt-6 border-t border-line pt-5 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in-0"
          >
            <h3
              id={`${id}-${command.replaceAll(" ", "-")}`}
              className="mb-3 flex items-center gap-2 font-mono text-xs text-accent"
            >
              <span aria-hidden="true">&gt;</span>
              {command}
            </h3>
            {command === "whoami" && (
              <div className="space-y-2">
                <p className="font-semibold">{briefing.name}</p>
                <p className="text-muted-foreground">{briefing.bio}</p>
                <p className="font-mono text-xs text-muted-foreground">Based in {briefing.location}</p>
              </div>
            )}
            {command === "ls projects" &&
              (briefing.projects.length ? (
                <ul className="space-y-4">
                  {briefing.projects.map((project) => (
                    <li key={project.href}>
                      <a
                        href={project.href}
                        className={`inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent ${focusStyle}`}
                      >
                        {project.name}
                        <ArrowUpRight size={14} />
                      </a>
                      <p className="text-[13px] text-muted-foreground">{project.blurb}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No case studies published yet.</p>
              ))}
            {command === "cat team-fit" && (
              <div>
                {briefing.fitIntro && <p className="mb-4 text-[13px] text-muted-foreground">{briefing.fitIntro}</p>}
                <ul className="space-y-3">
                  {briefing.capabilities.map(({ title, body }) => (
                    <li key={title}>
                      <p className="font-semibold">{title}</p>
                      <p className="text-[13px] text-muted-foreground">{body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {command === "sudo hire richard" && (
              <div>
                <p className="font-display text-lg font-semibold tracking-[-0.03em]">
                  Permission granted. Let&apos;s talk.
                </p>
                <a
                  href={briefing.contactHref}
                  className={`mt-3 inline-flex min-h-11 items-center gap-2 bg-accent px-4 font-semibold text-on-accent no-underline ${focusStyle}`}
                >
                  Discuss a role
                  <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </section>
        ))}
      </div>
      <div className="border-t border-line bg-surface px-5 py-3 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[10px] text-muted-foreground">
          <span>{explored}/3 files explored</span>
          <span className="flex gap-1" aria-hidden="true">
            {briefingCommands.map((command) => (
              <span key={command} className={`h-1 w-5 ${history.includes(command) ? "bg-accent" : "bg-line"}`} />
            ))}
          </span>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Briefing commands">
          {briefingCommands.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => run(command)}
              title={commandHints[command]}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 border px-2.5 font-mono text-[11px] transition-colors hover:border-accent hover:text-ink ${history.includes(command) ? "border-accent/50 text-ink" : "border-line text-muted-foreground"} ${focusStyle}`}
            >
              <span aria-hidden="true" className="text-accent">
                {history.includes(command) ? "✓" : ">"}
              </span>
              {command}
              {history.includes(command) && <span className="sr-only"> (explored)</span>}
            </button>
          ))}
        </div>
        {unlocked && (
          <button
            type="button"
            onClick={() => run("sudo hire richard")}
            className={`mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 border border-accent bg-accent/10 px-3 font-mono text-[11px] text-ink ${focusStyle}`}
          >
            <span aria-hidden="true" className="text-accent">
              ✦
            </span>{" "}
            sudo hire richard <span className="text-muted-foreground">/ bonus</span>
          </button>
        )}
      </div>
      <div className="border-t border-line px-5 py-3 sm:px-6">
        <p className="mb-2 text-xs text-muted-foreground">
          Ask for the AI summary <span className="text-ink">· 120 words max</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {links.map(({ id: provider, label, href }) => (
            <a
              key={provider}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${label} about Richard (opens in a new tab)`}
              data-analytics-event="ask_ai_clicked"
              data-analytics-provider={provider}
              className={`flex min-h-11 items-center justify-between gap-2 border border-line bg-surface px-3 text-sm font-medium text-ink no-underline transition-colors hover:border-accent ${focusStyle}`}
            >
              <span className="flex items-center gap-2">
                <AIProviderIcon provider={provider} />
                {label}
              </span>
              <ArrowUpRight size={14} className="hidden shrink-0 sm:block" />
            </a>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
