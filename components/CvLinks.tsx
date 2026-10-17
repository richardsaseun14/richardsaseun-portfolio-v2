import { cv } from "@/lib/content";
import { Download } from "./Icons";

export type CvLocation = "about" | "home" | "footer";

// Plain <a> (not next/link): /cv is a route handler that returns a file, not a page.
// data-cv-* attributes are the hooks for the `resume_clicked` analytics event (#8).

const buttonBase =
  "inline-flex h-12 items-center gap-2.5 px-5 font-semibold no-underline transition-colors sm:h-14 sm:px-7";

const buttonStyles = {
  primary: "bg-ink text-bg hover:bg-accent hover:text-on-accent",
  ghost: "border border-line text-muted-foreground hover:border-ink hover:text-ink",
};

/** "Download CV" button, a "View" link and the optional "Updated" label. Renders nothing without a CV. */
export function CvButtons({
  location,
  variant = "primary",
  full = false,
}: {
  location: Exclude<CvLocation, "footer">;
  variant?: keyof typeof buttonStyles;
  /** Stretch to full width on small screens. */
  full?: boolean;
}) {
  if (!cv.available) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${full ? "w-full sm:w-auto" : ""}`}>
      <a
        href={cv.href}
        download
        data-cv-action="download"
        data-cv-location={location}
        className={`${buttonBase} ${buttonStyles[variant]} ${full ? "w-full justify-center sm:w-auto" : ""}`}
      >
        <Download /> Download CV
      </a>
      <span className="meta flex items-center gap-3 text-muted-foreground">
        <a
          href={cv.viewHref}
          target="_blank"
          rel="noreferrer"
          data-cv-action="view"
          data-cv-location={location}
          className="text-ink"
        >
          View ↗
        </a>
        {cv.updatedLabel && <span>Updated {cv.updatedLabel}</span>}
      </span>
    </div>
  );
}

/** Compact text link for the footer. Renders nothing without a CV. */
export function CvFooterLink({ className = "" }: { className?: string }) {
  if (!cv.available) return null;
  return (
    <a href={cv.href} download data-cv-action="download" data-cv-location="footer" className={className}>
      CV ↓
    </a>
  );
}
