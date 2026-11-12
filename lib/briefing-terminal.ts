export const briefingCommands = ["whoami", "ls projects", "cat team-fit"] as const;
export type BriefingCommand = (typeof briefingCommands)[number];
export type TerminalCommand = BriefingCommand | "sudo hire richard";

export type TerminalBriefing = {
  name: string;
  bio: string;
  location: string;
  projects: { name: string; href: string; blurb: string }[];
  fitIntro: string;
  capabilities: { title: string; body: string }[];
  contactHref: string;
};

export function bonusUnlocked(history: readonly TerminalCommand[]): boolean {
  return briefingCommands.every((command) => history.includes(command));
}

/** A command is recorded once; the contact Easter egg requires all three briefings. */
export function exploreCommand(history: TerminalCommand[], command: TerminalCommand): TerminalCommand[] {
  if (history.includes(command) || (command === "sudo hire richard" && !bonusUnlocked(history))) return history;
  return [...history, command];
}
