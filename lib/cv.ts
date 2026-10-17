// Server-side: builds the /cv response from the PDF uploaded in Keystatic (Profile > CV).
// Kept free of Next.js imports so it can be unit tested.
import path from "node:path";
import { isPdfName } from "./cv-meta";

export const CV_DIR = path.join(process.cwd(), "content", "cv");
export const CV_FILENAME = "Richard-Saseun-CV.pdf";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

type ReadFile = (filePath: string) => Promise<Uint8Array>;

/** Only the basename is used, so a stored value can't point outside content/cv. */
export const resolveCvPath = (file: string) => path.join(CV_DIR, path.basename(file));

const isPdfData = (data: Uint8Array) => PDF_MAGIC.every((byte, i) => data[i] === byte);

const notFound = () =>
  new Response("CV not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

async function readIfExists(readFile: ReadFile, filePath: string): Promise<Uint8Array | null> {
  try {
    return await readFile(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getCvResponse({
  file,
  view,
  readFile,
}: {
  file: string | null | undefined;
  view: boolean;
  readFile: ReadFile;
}): Promise<Response> {
  if (!isPdfName(file)) return notFound();

  const data = await readIfExists(readFile, resolveCvPath(file));
  if (!data || !isPdfData(data)) return notFound();

  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${view ? "inline" : "attachment"}; filename="${CV_FILENAME}"`,
      "Content-Length": String(data.byteLength),
      // Each upload redeploys the site, so a short CDN cache is enough to keep it fresh.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
