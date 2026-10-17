// Client-safe CV metadata derived from the Profile singleton.
// The PDF itself is served by app/cv/route.ts (see lib/cv.ts).

export const CV_HREF = "/cv";
export const CV_VIEW_HREF = "/cv?view=1";

export type CvFields = { cv?: string | null; cvUpdated?: string | null };

export type CvMeta = {
  available: boolean;
  href: string;
  viewHref: string;
  updatedLabel?: string;
};

export const isPdfName = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.toLowerCase().endsWith(".pdf");

/** "2026-10-01" -> "October 2026". Undefined for empty or invalid dates. */
export function formatCvUpdated(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return undefined;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function getCvMeta(fields: CvFields): CvMeta {
  return {
    available: isPdfName(fields.cv),
    href: CV_HREF,
    viewHref: CV_VIEW_HREF,
    updatedLabel: formatCvUpdated(fields.cvUpdated),
  };
}
