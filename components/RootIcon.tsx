import type { RootKey } from "@/lib/content";

export function RootIcon({ kind }: { kind: RootKey }) {
  if (kind === "roots") {
    return (
      <svg role="img" aria-label="Flag of Nigeria" width="112" height="56" viewBox="0 0 6 3" className="block border border-line">
        <rect x="0" y="0" width="2" height="3" fill="#008751" />
        <rect x="2" y="0" width="2" height="3" fill="#FFFFFF" />
        <rect x="4" y="0" width="2" height="3" fill="#008751" />
      </svg>
    );
  }
  if (kind === "faith") {
    return (
      <svg aria-hidden width="44" height="56" viewBox="0 0 22 28" fill="none" stroke="var(--accent)" strokeWidth="2.2">
        <path d="M11 1v26M3 9h16" />
      </svg>
    );
  }
  return (
    <svg aria-hidden width="72" height="44" viewBox="0 0 36 22" fill="none" stroke="var(--accent)" strokeWidth="2">
      <circle cx="12" cy="11" r="9" />
      <circle cx="24" cy="11" r="9" />
    </svg>
  );
}
