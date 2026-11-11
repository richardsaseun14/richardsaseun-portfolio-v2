import Image from "next/image";
export function Media({
  src,
  alt,
  priority = false,
  aspectRatio = 16 / 9,
}: {
  src?: string | null;
  alt: string;
  priority?: boolean;
  aspectRatio?: number;
}) {
  return (
    <div style={{ aspectRatio }} className="relative overflow-hidden border border-line bg-line/20">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1100px"
          className="object-contain"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center p-6 text-center meta text-muted-foreground">
          TODO: Add {alt}
        </span>
      )}
    </div>
  );
}
