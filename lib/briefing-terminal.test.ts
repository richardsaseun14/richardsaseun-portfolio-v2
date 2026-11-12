import { describe, expect, it } from "vitest";
import { bonusUnlocked, exploreCommand, type TerminalCommand } from "./briefing-terminal";

describe("terminal exploration", () => {
  it("unlocks the bonus only after all three different briefings, in any order", () => {
    let history: TerminalCommand[] = [];
    expect(bonusUnlocked(history)).toBe(false);
    history = exploreCommand(history, "cat team-fit");
    history = exploreCommand(history, "ls projects");
    expect(bonusUnlocked(history)).toBe(false);
    history = exploreCommand(history, "whoami");
    expect(bonusUnlocked(history)).toBe(true);
    expect(exploreCommand(history, "sudo hire richard")).toEqual([
      "cat team-fit",
      "ls projects",
      "whoami",
      "sudo hire richard",
    ]);
  });

  it("does not let repeated commands advance progress or duplicate output", () => {
    const history = exploreCommand([], "whoami");
    expect(exploreCommand(history, "whoami")).toBe(history);
    expect(bonusUnlocked(history)).toBe(false);
    expect(history).toEqual(["whoami"]);
  });

  it("rejects the bonus before all three briefings have been explored", () => {
    const history: TerminalCommand[] = ["whoami", "ls projects"];
    expect(exploreCommand(history, "sudo hire richard")).toBe(history);
    expect(history).toEqual(["whoami", "ls projects"]);
  });

  it("leaves previous history untouched when adding a command", () => {
    const history: TerminalCommand[] = [];
    expect(exploreCommand(history, "whoami")).toEqual(["whoami"]);
    expect(history).toEqual([]);
  });
});
