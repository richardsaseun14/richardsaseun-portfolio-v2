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
| All editable copy (profile, home, about, side quests, side projects) | `content/*.json`, edited at `/keystatic` |
| Projects and case studies | `content/projects/<slug>.json`, edited at `/keystatic` |
| Content schema (what the editor shows) | `keystatic.config.ts`, `keystatic/schema/*` |
| Typed content for components, plus nav / shortcuts | `lib/content.ts`, `lib/projects.ts` |
| Colours, fonts, shared utilities (eyebrow, page-title, stripes…) | `app/(site)/globals.css` |
| Pages | `app/(site)/page.tsx` (Home), `app/(site)/work`, `app/(site)/work/[slug]` (case study), `app/(site)/about`, `app/(site)/side-quests` |
| Theme / sound / keyboard shortcuts / click sounds | `components/PrefsProvider.tsx` |
| Nav, footer, scrolling top bar | `components/Header.tsx`, `Footer.tsx`, `Marquee.tsx` |
| Portrait | `public/richard-portrait.jpg` |

## Editing content (Keystatic)

Content is managed with [Keystatic](https://keystatic.com). It is stored as JSON in `content/`, so there is no database and every edit is a git commit.

- **Locally:** run `npm run dev` and open http://localhost:3000/keystatic. Saves write straight to `content/`; commit and push as usual.
- **Side projects:** Work > Side projects. Add new builds to the top.
- **Case studies:** Work > Projects > Add. The slug becomes the URL (`/work/<slug>`); `Order` controls position.
- **Images** (posters, covers) upload to `public/images/<folder>/`.

### Editing from the live site (GitHub mode)

Set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` to make `/keystatic` commit to GitHub instead of the local disk. Each save then triggers a redeploy.

One-time setup:
1. Locally, add `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` to `.env.local`, run `npm run dev` and open `/keystatic`.
2. Follow the prompt to create a GitHub App for the repo. Keystatic writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env.local`.
3. Copy those four values plus `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` into your host's environment variables (e.g. Vercel) and redeploy.
4. In the GitHub App settings, add `https://<your-domain>/api/keystatic/github/oauth/callback` as a callback URL.

Only GitHub users with write access to the repo can sign in and save.

## Watch lists (Simkl)

The Watching now, Recently finished and Up next carousels on `/side-quests` come from Simkl. They refresh hourly and disappear when the env vars below aren't set.

One-time setup:
1. Create an app at https://simkl.com/settings/developer/ and choose "TV, devices & command line". Copy its Client ID.
2. Request a device code, then open the returned `verification_uri` and enter the `user_code`:
   ```bash
   curl -X POST "https://api.simkl.com/oauth2/device" -d "client_id=YOUR_CLIENT_ID"
   ```
3. Once approved, exchange the `device_code` for a token (repeat if it answers `authorization_pending`):
   ```bash
   curl -X POST "https://api.simkl.com/oauth2/token" -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" -d "device_code=DEVICE_CODE" -d "client_id=YOUR_CLIENT_ID"
   ```
4. Put `SIMKL_CLIENT_ID` and the returned `access_token` as `SIMKL_ACCESS_TOKEN` in `.env.local` (see `.env.example`) and in your host's environment variables.

## Music (Spotify)

The Music block on `/side-quests` shows your most-played Spotify track from the last ~4 weeks (cover, title, artist, link). It refreshes hourly. The note and playlists link come from Keystatic, and the whole block falls back to Keystatic content when the env vars below aren't set.

One-time setup:
1. Create an app at https://developer.spotify.com/dashboard (select "Web API"). Add the redirect URI `http://127.0.0.1:3000/callback` (Spotify rejects `localhost`). Copy the Client ID and Client Secret.
2. Open this URL, approve, then copy the `code` parameter from the address bar it redirects to (the page itself won't load, which is fine):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:3000/callback&scope=user-top-read
   ```
3. Exchange the code for a refresh token (codes expire after a few minutes):
   ```bash
   curl -X POST "https://accounts.spotify.com/api/token" -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" -d "grant_type=authorization_code" -d "code=CODE" -d "redirect_uri=http://127.0.0.1:3000/callback"
   ```
4. Put `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and the returned `refresh_token` as `SPOTIFY_REFRESH_TOKEN` in `.env.local` (see `.env.example`) and in your host's environment variables.

Apps in development mode only work for users on the app's allowlist; the owner account is enough here.

## Design tokens

- Fonts: **Unbounded** (headings), **Figtree** (body), **JetBrains Mono** (labels)
- Accent: `#7C3AED` (dark mode `#8B5CF6`)
- Light background `#FAFAFA`, ink `#2B2A26`
- Theme is stored on `<html data-theme>`; Tailwind `dark:` targets it.

## Keyboard shortcuts

`T` top · `B` bottom · `S` sound · `L` light · `D` dark · `A` auto · `?` shortcuts panel · `Esc` close.
Ignored while typing or when Cmd/Ctrl/Alt is held. Theme and sound choices persist in `localStorage`; the shortcuts tip shows once.

## Still to fill in

Everything in `[brackets]` in the editor (or `content/`): email, social handles, project names, screenshots, job history, watchlists and so on.
