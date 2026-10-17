import { readFile } from "node:fs/promises";
import profile from "@/content/profile.json";
import type { CvFields } from "@/lib/cv-meta";
import { getCvResponse } from "@/lib/cv";

// Stable, shareable CV link. `/cv` downloads; `/cv?view=1` opens in the browser.
export async function GET(request: Request) {
  const view = new URL(request.url).searchParams.get("view") === "1";
  const { cv }: typeof profile & CvFields = profile;
  return getCvResponse({ file: cv, view, readFile });
}
