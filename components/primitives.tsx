import Link from "next/link";
import { ArrowRight } from "./Icons";

/** Small mono label + big section title, used at the top of most sections. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
  children,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {children}
      </div>
      {aside}
    </div>
  );
}

/** Page header: eyebrow row, giant uppercase title and an intro line. */
export function PageIntro({
  eyebrow,
  eyebrowRight,
  title,
  intro,
  action,
}: {
  eyebrow: string;
  eyebrowRight?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="container-x pt-18">
      <div className="eyebrow flex flex-wrap justify-between gap-3 pb-7">
        <span>{eyebrow}</span>
        {eyebrowRight && <span>{eyebrowRight}</span>}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h1 className="page-title">
          {title}
          <span className="text-accent">.</span>
        </h1>
        {action}
      </div>
      {intro && (
        <p className="mt-10 max-w-[680px] text-[clamp(20px,2vw,26px)] leading-[1.3] tracking-[-0.015em] text-pretty text-muted-foreground">
          {intro}
        </p>
      )}
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = true,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost" | "ghost-invert";
  icon?: boolean;
  external?: boolean;
}) {
  const styles = {
    primary: "bg-ink text-bg hover:bg-accent hover:text-on-accent",
    accent: "bg-accent text-on-accent hover:text-on-accent hover:opacity-90",
    ghost: "border border-line text-muted-foreground hover:border-ink hover:text-ink",
    "ghost-invert": "border border-[rgba(128,128,128,0.5)] text-[inherit] hover:border-current hover:text-[inherit]",
  }[variant];
  const cls = `inline-flex h-14 items-center gap-2.5 px-7 font-semibold no-underline transition-colors ${styles}`;
  const content = (
    <>
      {children}
      {icon && <ArrowRight />}
    </>
  );
  if (external || href.startsWith("mailto:") || href.startsWith("http") || href === "#") {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Striped placeholder box for screenshots, posters and covers. */
export function Placeholder({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`stripes meta grid place-items-center border border-line text-muted-foreground ${className}`}>
      {label}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <span className="block h-[3px] bg-line" role="presentation">
      <span className="block h-[3px] bg-accent" style={{ width: `${value}%` }} />
    </span>
  );
}
