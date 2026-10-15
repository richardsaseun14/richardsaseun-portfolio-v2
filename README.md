# richardsaseun-portfolio-v2

Personal portfolio for Richard Saseun. Built with Next.js (App Router), TypeScript and Tailwind CSS v4, from the "Richard Saseun — Portfolio" design canvas.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Where things live

| What | Where |
| --- | --- |
| All copy, projects, side projects, experience, watchlists, games, books | `lib/content.ts` |
| Colours, fonts, shared utilities (eyebrow, page-title, stripes…) | `app/globals.css` |
| Pages | `app/page.tsx` (Home), `app/labs`, `app/labs/[slug]` (case study), `app/changelog`, `app/side-quests` |
| Theme / sound / keyboard shortcuts / click sounds | `components/PrefsProvider.tsx` |
| Nav, footer, scrolling top bar | `components/Header.tsx`, `Footer.tsx`, `Marquee.tsx` |
| Portrait | `public/richard-portrait.jpg` |

### Adding a side project
Add an entry to the top of `sideProjects` in `lib/content.ts`. The card and the "builds so far" count update automatically.

### Adding a case study
Add a project to `projects` in `lib/content.ts` with a unique `slug` and a `caseStudy` object. It gets its own page at `/labs/<slug>`.

## Design tokens

- Fonts: **Unbounded** (headings), **Figtree** (body), **JetBrains Mono** (labels)
- Accent: `#7C3AED` (dark mode `#8B5CF6`)
- Light background `#EAE7DF`, ink `#2B2A26`
- Theme is stored on `<html data-theme>`; Tailwind `dark:` targets it.

## Keyboard shortcuts

`T` top · `B` bottom · `S` sound · `L` light · `D` dark · `A` auto · `?` shortcuts panel · `Esc` close.
Ignored while typing or when Cmd/Ctrl/Alt is held. Theme and sound choices persist in `localStorage`; the shortcuts tip shows once.

## Still to fill in

Everything in `[brackets]` in `lib/content.ts`: email, social handles, project names, screenshots, job history, watchlists and so on.
