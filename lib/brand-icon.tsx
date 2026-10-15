// Renders the "r.s" brand mark for favicons, matching the Wordmark component:
// Unbounded ExtraBold, ink tile, light letters, purple dot.
import { ImageResponse } from "next/og";

const INK = "#2b2a26";
const PAPER = "#fafafa";
const ACCENT = "#8b5cf6";

async function loadUnbounded(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Unbounded:wght@800&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!fontUrl) throw new Error("Could not resolve Unbounded font for the favicon");
  return (await fetch(fontUrl)).arrayBuffer();
}

export async function renderBrandIcon(size: number, { rounded = true } = {}) {
  const font = await loadUnbounded("r.s");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
          borderRadius: rounded ? size * 0.22 : 0,
          color: PAPER,
          fontFamily: "Unbounded",
          fontWeight: 800,
          fontSize: size * 0.52,
          letterSpacing: `-${size * 0.02}px`,
          paddingBottom: size * 0.04,
        }}
      >
        r<span style={{ color: ACCENT }}>.</span>s
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Unbounded", data: font, weight: 800, style: "normal" }],
    },
  );
}
