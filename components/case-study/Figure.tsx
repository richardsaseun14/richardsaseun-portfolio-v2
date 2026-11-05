import type { ReactNode } from "react";
import { Media } from "./Media";
export function Figure({
  src,
  alt,
  caption,
  aspectRatio,
}: {
  src?: string;
  alt: string;
  caption: string;
  aspectRatio?: number;
}) {
  return (
    <figure>
      <Media src={src} alt={alt} aspectRatio={aspectRatio} />
      <figcaption className="meta mt-3 text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
export function FigurePair({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 gap-6 md:grid-cols-2">{children}</div>;
}

export function MobileGallery({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-4 [&>figure]:mx-auto [&>figure]:w-full [&>figure]:max-w-[274px]">
      {children}
    </div>
  );
}
