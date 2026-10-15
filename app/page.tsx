import Link from "next/link";
import { HeroName } from "@/components/HeroName";
import { ExploreCards } from "@/components/ExploreCards";
import { ArrowRight } from "@/components/Icons";
import { ButtonLink, Placeholder, SectionHeading } from "@/components/primitives";
import { mailto, pipeline, principles, projects, site, stack, stats } from "@/lib/content";

export default function Home() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const more = projects.filter((p) => p !== featured).slice(0, 2);

  return (
    <main>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="container-x pt-12 pb-14 sm:pt-18">
        <div className="eyebrow flex flex-wrap justify-between gap-3 pb-7">
          <span>Full-stack engineer · Web &amp; mobile</span>
          <span>Building since 2017</span>
        </div>
        <HeroName />
        <div className="mt-12 grid items-end gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr))]">
          <p className="max-w-[640px] text-[clamp(22px,2.2vw,30px)] leading-[1.25] tracking-[-0.02em] text-pretty">
            A software engineer who thinks like a product owner. I use AI-assisted workflows to move faster and
            engineering discipline to make sure what ships, lasts.
          </p>
          <div className="flex flex-wrap justify-start gap-3 sm:justify-end">
            <ButtonLink href={mailto} full>
              Discuss a role
            </ButtonLink>
            <ButtonLink href="/labs" variant="ghost" icon={false} full>
              Explore Labs
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Track record" className="border-y border-line">
        <div className="container-x grid [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-t border-line py-6 first:border-t-0 sm:border-t-0 sm:py-8 ${i === 0 ? "sm:pr-6" : "sm:px-6"} ${
                i < stats.length - 1 ? "sm:border-r" : ""
              }`}
            >
              <div className="font-display text-[clamp(44px,4.6vw,64px)] leading-none font-extrabold tracking-[-0.04em]">
                {s.value}
                {s.accent && <span className="text-accent">{s.accent}</span>}
              </div>
              <div className="meta mt-3 text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* End to end */}
      <section aria-labelledby="solo-title" className="container-x pt-20 sm:pt-30">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <span className="eyebrow flex-[1_1_200px] pt-2.5">End to end</span>
          <div className="flex flex-[999_1_640px] flex-col gap-7">
            <h2
              id="solo-title"
              className="font-display text-[clamp(32px,4vw,56px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-pretty"
            >
              At home across the whole stack: interface, API, database, pipeline and tests
              <span className="text-accent">.</span>
            </h2>
            <p className="max-w-[720px] text-[clamp(19px,1.8vw,24px)] leading-[1.35] tracking-[-0.015em] text-pretty text-muted-foreground">
              So I can own a feature end to end or slot into any part of a team and understand how my piece connects to
              everyone else&apos;s.
            </p>
            <ol aria-label="What I cover" className="mt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-[0.06em]">
              {pipeline.map((step, i) => (
                <li key={step} className="contents">
                  <span
                    className={`px-3.5 py-2.5 ${
                      i === pipeline.length - 1 ? "border border-accent bg-accent text-on-accent" : "border border-ink"
                    }`}
                  >
                    {step}
                  </span>
                  {i < pipeline.length - 1 && (
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section aria-labelledby="work-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading
          id="work-title"
          eyebrow="Selected work"
          title="Products, not just pages."
          aside={
            <Link
              href="/labs"
              className="meta inline-flex h-11 items-center gap-2.5 border border-line px-[18px] text-ink no-underline hover:border-ink"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          }
        />

        <Link
          href={`/labs/${featured.slug}`}
          className="group grid overflow-hidden border border-line bg-surface text-ink no-underline hover:text-ink [grid-template-columns:repeat(auto-fit,minmax(min(480px,100%),1fr))]"
        >
          <div className="overflow-hidden border-b border-line md:border-r md:border-b-0">
            <Placeholder
              label="[Product screenshot]"
              className="aspect-[4/3] border-0 transition-transform duration-400 group-hover:scale-[1.015]"
            />
          </div>
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
            <div className="flex flex-col gap-4">
              <div className="meta flex flex-wrap gap-2">
                <span className="bg-accent px-2.5 py-1.5 text-on-accent">Featured</span>
                <span className="border border-line px-2.5 py-1.5 text-muted-foreground">{featured.type}</span>
                <span className="border border-line px-2.5 py-1.5 text-muted-foreground">{featured.role}</span>
              </div>
              <h3 className="font-display text-[clamp(32px,8vw,44px)] leading-none font-extrabold tracking-[-0.03em]">{featured.name}</h3>
              <p className="max-w-[460px] text-lg text-pretty text-muted-foreground">{featured.blurb}</p>
            </div>
            {featured.metrics && (
              <div className="grid grid-cols-2 border-t border-line">
                {featured.metrics.slice(0, 2).map((m, i) => (
                  <div key={m.label} className={`py-5 ${i === 0 ? "border-r border-line pr-4" : "pl-4 sm:pl-6"}`}>
                    <div className="font-display text-[clamp(26px,7vw,32px)] font-extrabold tracking-[-0.03em]">
                      {m.value}
                      {m.accent}
                    </div>
                    <div className="meta text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
            <span className="inline-flex items-center gap-2.5 font-semibold">
              Read the case study <ArrowRight />
            </span>
          </div>
        </Link>

        <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr))]">
          {more.map((p) => (
            <Link
              key={p.slug}
              href={`/labs/${p.slug}`}
              className="group flex flex-col overflow-hidden border border-line bg-surface text-ink no-underline hover:text-ink"
            >
              <div className="overflow-hidden border-b border-line">
                <Placeholder
                  label="[Screenshot]"
                  className="aspect-[16/10] border-0 transition-transform duration-400 group-hover:scale-[1.015]"
                />
              </div>
              <div className="flex flex-col gap-2.5 p-6 sm:p-7">
                <span className="meta text-muted-foreground">
                  {p.type} · {p.year}
                </span>
                <h3 className="font-display text-[clamp(26px,7vw,30px)] font-extrabold tracking-[-0.03em]">{p.name}</h3>
                <p className="text-muted-foreground">{p.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How I work */}
      <section aria-labelledby="approach-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading
          id="approach-title"
          eyebrow="How I work"
          title={
            <>
              Engineer by trade.
              <br />
              Product person by habit.
            </>
          }
        />
        <div className="grid border-t border-ink [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className={`flex flex-col gap-3.5 border-t border-line py-7 first:border-t-0 sm:border-t-0 sm:py-8 ${
                i === 0 ? "sm:pr-8" : "sm:border-l sm:px-8"
              }`}
            >
              <h3 className="text-[22px] font-semibold tracking-[-0.015em]">{p.title}</h3>
              <p className="text-pretty text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section aria-labelledby="stack-title" className="container-x pt-20 sm:pt-30">
        <SectionHeading
          id="stack-title"
          eyebrow="Stack"
          title="The toolbox."
          aside={<span className="eyebrow">Spec sheet · v{new Date().getFullYear()}</span>}
        />
        <div className="border-t border-ink">
          {stack.map((row) => (
            <div key={row.group} className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line py-6 hover:bg-surface">
              <span className="eyebrow basis-full sm:flex-[0_0_200px]">{row.group}</span>
              <div className="flex flex-[1_1_320px] flex-wrap gap-2">
                {row.items.map((item) => (
                  <span
                    key={item}
                    className="border border-line px-3 py-2 font-medium sm:px-4 sm:py-2.5 transition-colors hover:bg-ink hover:text-bg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-title" className="container-x py-20 sm:py-30">
        <div className="flex flex-col gap-10 bg-invert p-[clamp(32px,6vw,80px)] text-invert-ink">
          <span className="meta text-[13px] opacity-70">Next step</span>
          <h2
            id="cta-title"
            className="font-display text-[clamp(44px,7vw,112px)] leading-[0.9] font-black tracking-[-0.045em] uppercase"
          >
            Have a role
            <br />
            or a product<span className="text-accent">?</span>
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-[520px] text-lg opacity-85 sm:text-xl">
              Open to full-time engineering roles and select client builds. Tell me what you&apos;re working on.{" "}
              {site.replyTime}
            </p>
            <ButtonLink href={mailto} variant="accent" full>
              Start the conversation
            </ButtonLink>
          </div>
        </div>
      </section>

      <ExploreCards items={["changelog", "sideQuests"]} />
    </main>
  );
}
