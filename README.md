# StudentCalcHub

Free academic calculators for US students — GPA & graduation, chemistry lab, test prep and
statistics. Every tool shows its working, cites official sources, and collects no student data.
Funded by AdSense.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, zod, Vitest and Playwright.
Next.js 16 has breaking changes: read `node_modules/next/dist/docs/` before touching framework APIs.

## Setup

```bash
npm install
npx playwright install chromium   # once, for the e2e tests
npm run dev                       # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Runs the data freshness check (`scripts/check-freshness.mjs`), then a production build |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types and runs `tsc --noEmit` |
| `npm test` | Vitest unit tests: math, data schemas, registry, content, sitemap |
| `npm run test:e2e` | Playwright smoke test of every sitemap URL at 375px. Builds and starts the site on port 3456, or reuses a server already running there |

Before a release, run `npm run lint && npm run typecheck && npm test && npm run build`. The build
should print `freshness check: 0 stale record(s)`.

## Environment variables

All are optional; leave the AdSense ones unset until the account is approved.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for canonicals, sitemap, JSON-LD and `llms.txt`. Defaults to `https://www.studentcalchub.com` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-…`). Unset: no ad script loads and `/ads.txt` returns 404 |
| `NEXT_PUBLIC_ADSENSE_SLOT_AFTER_RESULT` | Ad unit ID shown after a tool's result |
| `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT` | Ad unit ID inside the explainer content |
| `NEXT_PUBLIC_ADSENSE_SLOT_END_OF_PAGE` | Ad unit ID at the end of the page |

## Adding content

### A tool

1. Put the math in `lib/<hub>/<name>.ts` as pure functions returning `Result<…>`, with tests
   in `tests/<hub>/` written first.
2. Build the client component at `components/tools/<slug>/<slug>-tool.tsx`.
3. Write the config at `config/tools/<slug>.ts`. It needs a title of 60 characters or fewer, a
   description of 160 or fewer, at least 4 FAQs ending in "?", at least one official source,
   and `related` entries that are tool slugs or `/paths`.
4. Write the explainer at `content/tools/<slug>.mdx`. It needs the headings `## How it works`,
   `## Worked example`, `## When to use this` and `## Common mistakes`.
5. Register the tool in three places:
   - `config/tools/index.ts` (`TOOLS`)
   - `components/tools/instance-slugs.ts` (`TOOL_COMPONENT_SLUGS`)
   - `components/tools/instances.ts` (`TOOL_COMPONENTS`)
6. Run `npm test`. The registry and content tests enforce every rule above. The tool then shows
   up automatically on its hub page, the sitemap and `llms.txt`, and on the homepage for every
   hub except GPA, whose homepage cards are set in `config/featured.ts`.

### A college or a state

Add `data/colleges/<slug>.json` or `data/states/<slug>.json`, using an existing file as the
template. Only values confirmed on an official page (registrar or catalog; state department of
education or statute) go in, with each URL in `sources` and today's date in `lastChecked`. If a
value can't be confirmed, leave the record out. Then run `npm test`: the zod schemas validate
every file. The page, the sibling links, the homepage chips and the sitemap entry are all
generated from the file.

### Keeping data current

Follow [docs/data-recheck-runbook.md](docs/data-recheck-runbook.md). The build warns about any
record that hasn't been re-checked in 12 months.

## AdSense application checklist

- [ ] Domain is live on its final URL, with `NEXT_PUBLIC_SITE_URL` set to it
- [ ] All four hubs are live (GPA & Graduation, Chemistry & Lab, Test Prep, Statistics), with every tool and data page building
- [ ] Google Search Console is verified for the domain, and `/sitemap.xml` is submitted
- [ ] The privacy policy, terms, disclaimer, about, editorial policy and contact pages are live and linked in the footer
- [ ] Apply for AdSense. After approval, set `NEXT_PUBLIC_ADSENSE_CLIENT` and the slot IDs, then redeploy so `/ads.txt` is served
- [ ] In the AdSense dashboard (Privacy & messaging), enable Google's certified CMP for EEA/UK visitors
