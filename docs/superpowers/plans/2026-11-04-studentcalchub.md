# StudentCalcHub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build StudentCalcHub, a static Next.js site of academic calculators and data lookup pages for US students, in four hubs (GPA & Graduation, Chemistry, Statistics, Test Prep). It must be ready for an AdSense application.

**Architecture:** This mirrors the owner's `calculate-finance` project (`/home/hp/Projects/Test-Project/calculate-finance`).
- A typed tool registry drives routes, the sitemap, hub listings and related links.
- Math lives in pure functions under `lib/`, unit-tested with Vitest.
- Each calculator is a client component, and each tool's written sections live in MDX.
- College and state data are JSON files validated with zod at build time, and every page is statically generated.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, lucide-react, zod, next-mdx-remote, Vitest, Playwright, @vercel/analytics.

**Spec:** `docs/superpowers/specs/2026-11-04-studentcalchub-design.md` (read it before any task).

## Global Constraints

- **Project root:** `/home/hp/Projects/Test-Project/studentcalchub`. All paths below are relative to it.
- **Next.js docs:** This Next.js version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing route, metadata or config code, and copy the AGENTS.md block that `next dev` generates.
- **Match calculate-finance:** Use its dependency versions, tooling (eslint, prettier, tsconfig `@/*` alias, vitest config), design-token approach in `app/globals.css`, `components/ui/*` primitives, theme provider, `components/seo/*`, `lib/seo/schema.ts` and contact form. Copy and adapt these files; don't rewrite them from scratch. Drop the currency, affiliate, charts and recharts code.
- **Site identity:**
  - Name: `StudentCalcHub`
  - URL: `process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studentcalchub.com'`
  - Author: `Arslan Sarwar` (byline links to `/about`)
  - Contact: `arslansarwarwebdev@gmail.com`
  - The contact form opens the visitor's mail app (`mailto:`). There is no server endpoint.
- **No data leaves the browser:** No API routes except `ads.txt`, `robots`, `sitemap` and `llms.txt`. No cookies of our own and no localStorage of user inputs.
- **No made-up data:** Every college or state value comes from an official source URL stored with the record, plus a `lastChecked` ISO date. If a value can't be confirmed from an official source, leave the entity out.
- **Learning note:** Every tool page shows this exact sentence: `Use this tool to learn and check your work, not to replace your own.`
- **Test prep estimates:** Test prep results are labelled **estimates**. Never copy an official conversion table verbatim, and never reproduce test questions.
- **Content tone:** Original, plain English, roughly grade 8–10 reading level. US spelling.
- **Ads:** `<AdSlot>` renders `null` unless `NEXT_PUBLIC_ADSENSE_CLIENT` is set. Ads never go above a calculator or between its inputs and result.
- **Commit after each task.** Conventional commit messages.

## Review Focus

These are the input cases most likely to break for real students. Each one has a test in the task that owns it.

1. **Blank, partial or non-numeric calculator input** (e.g. `""`, `"abc"`, `"1,200"`): show no result and a short message. Never show `NaN`, `Infinity` or a crash. Pinned in Task 3 (`parseNumberInput`) and the e2e test in Task 15.
2. **Ambiguous trailing zeros in sig figs** (`"1500"`): report 2 significant figures and flag `ambiguous`. `"1500."` and `"1.500e3"` are unambiguous (4). Pinned in Task 9.
3. **Chemical formulas typed casually** (`"co2"`, `"CuSO4·5H2O"`, `"CuSO4*5H2O"`, `"Ca(OH)2"`, `"Xx2"`): parse the valid ones, and give clear errors for the bad ones. `co2` gets a capitalization hint. Pinned in Task 10.
4. **Grades with no GPA value** (`P`, `NP`, `W`, `I`) and `A+` on a 4.0-cap scale: exclude the non-GPA grades and list them as excluded. A+ is capped at the college's own value. Pinned in Task 5.
5. **Divide-by-zero cases:**
   - Percent error with accepted value `0`
   - Dilution with a zero or missing value, or more than one unknown
   - Sample size with margin of error `0`

   Each returns a typed error with a message, not a number. Pinned in Tasks 9, 10 and 12.

---

## File Structure

```
app/
  layout.tsx, page.tsx (homepage), globals.css, not-found.tsx, robots.ts, sitemap.ts,
  manifest.ts, opengraph-image.tsx, icon.svg, ads.txt/route.ts, llms.txt/route.ts
  about/ contact/ privacy/ terms/ disclaimer/ editorial-policy/   (site pages)
  gpa/page.tsx (hub index)
  gpa/[tool]/page.tsx                 (generic tool route for gpa hub)
  gpa/latin-honors/page.tsx           (overview table + qualify checker)
  gpa/college/[college]/page.tsx      (combined GPA scale + honors page)
  high-school-credits/page.tsx, high-school-credits/[state]/page.tsx
  chemistry/page.tsx, chemistry/[tool]/page.tsx
  statistics/page.tsx, statistics/[tool]/page.tsx
  test-prep/page.tsx, test-prep/[tool]/page.tsx
config/
  site.ts, hubs.ts, ads.ts
  tools/types.ts, tools/index.ts, tools/<slug>.ts (one per tool)
components/
  ui/*, seo/*, navigation/*, contact/*, theme-provider.tsx  (adapted from calculate-finance)
  ads/ad-slot.tsx, ads/adsense-script.tsx
  tools/tool-page.tsx, tools/learning-note.tsx, tools/steps-list.tsx, tools/faq-section.tsx,
  tools/related-tools.tsx, tools/sources-list.tsx, tools/number-field.tsx, tools/instances.ts
  tools/<slug>/<slug>-tool.tsx (one client component per tool)
  data/college-honors-checker.tsx, data/credits-remaining.tsx, data/term-gpa.tsx
content/tools/<slug>.mdx
data/colleges/<slug>.json, data/states/<slug>.json, data/test-prep/nmsqt-cutoffs.json
lib/
  input.ts, content/read-content.ts, seo/schema.ts
  data/schema.ts, data/colleges.ts, data/states.ts, data/freshness.ts
  gpa/scale.ts, gpa/term-gpa.ts, gpa/honors.ts, credits/remaining.ts
  chemistry/sig-figs.ts, chemistry/percent-error.ts, chemistry/elements.ts,
  chemistry/formula.ts, chemistry/molarity.ts
  statistics/test-chooser.ts, statistics/sample-size.ts
  test-prep/sat.ts, test-prep/psat.ts, test-prep/act.ts
scripts/check-freshness.mjs
docs/data-recheck-runbook.md
tests/** (mirrors lib/ and config/), e2e/smoke.spec.ts
```

**Shared types used across tasks**, defined once in the task noted:

```ts
// lib/steps.ts (Task 3)
export interface Step { label: string; detail: string }  // e.g. { label: 'Subtract', detail: '|52.3 − 50.0| = 2.3' }

// lib/result.ts (Task 3)
export type Result<T> = { ok: true; value: T } | { ok: false; error: string }
```

---

### Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.mts`, `.prettierrc`, `.gitignore`, `app/layout.tsx`, `app/page.tsx` (placeholder), `app/globals.css`, `components/ui/*`, `components/theme-provider.tsx`, `lib/utils.ts`, `README.md`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: the `@/*` path alias, the `npm run dev|build|lint|typecheck|test|test:e2e` scripts, and the `cn()` helper in `lib/utils.ts`.

- [ ] **Step 1:** Run `git init` in `studentcalchub/`. Copy the configs listed above from calculate-finance, then rename the package to `studentcalchub`.
  - Remove `recharts`, `cmdk` and `@vercel/analytics`. Add `@vercel/analytics` back in Task 2.
  - In `next.config.ts`, replace the apex→www redirect host with `studentcalchub.com`, and delete the calculator-specific redirects.
- [ ] **Step 2:** Run `npm install`. It should finish with no errors.
- [ ] **Step 3:** Write `tests/smoke.test.ts`, asserting `cn('a', false && 'b', 'c') === 'a c'`.
- [ ] **Step 4:** Run `npm test`. Expected: 1 passed.
- [ ] **Step 5:** Pick a new accent color for `app/globals.css`, distinct from calculate-finance's teal: a trustworthy indigo/blue. Keep the same token names, and keep both light and dark themes.
- [ ] **Step 6:** Run `npm run build && npm run lint && npm run typecheck`. All three should pass.
- [ ] **Step 7:** Commit, including the existing `docs/` folder: `chore: scaffold StudentCalcHub`.

### Task 2: Site shell, SEO, ads and site pages

**Files:**
- Create:
  - Config and components: `config/site.ts`, `config/hubs.ts`, `config/ads.ts`, `components/navigation/{header,footer,mobile-nav,theme-toggle}.tsx`, `components/seo/{json-ld,breadcrumbs}.tsx`, `lib/seo/schema.ts`, `components/ads/ad-slot.tsx`, `components/ads/adsense-script.tsx`, `components/contact/contact-form.tsx`, `lib/validation/contact.ts`
  - Routes: `app/ads.txt/route.ts`, `app/robots.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/not-found.tsx`, `app/llms.txt/route.ts`
  - Site pages: `app/{about,contact,privacy,terms,disclaimer,editorial-policy}/page.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/ads/ads.test.ts`, `tests/config/hubs.test.ts`

**Interfaces:**
- Produces:
  - `SITE` with `{ name, tagline, description, url, disclaimerShort }`, plus `CONTACT_EMAIL` and `EDITORIAL = { name: 'Arslan Sarwar', href: '/about' }`
  - `HubSlug = 'gpa' | 'chemistry' | 'statistics' | 'test-prep'`
  - `HUBS: Hub[]`, where `Hub = { slug: HubSlug; name: string; summary: string; href: string }`. Order: gpa, chemistry, test-prep, statistics.
  - `<AdSlot placement: 'after-result' | 'in-content' | 'end-of-page' />`
  - `adsTxt(client?: string): string | null`
  - The schema helpers `breadcrumbSchema(items)`, `faqSchema(faqs)` and `webApplicationSchema({name, description, url})`
  - `<Breadcrumbs items={{label, href}[]} />` and `<JsonLd data />`

- [ ] **Step 1:** Write the failing tests:
  - `adsTxt(undefined)` returns `null`.
  - `adsTxt('ca-pub-123')` returns `'google.com, pub-123, DIRECT, f08c47fec0942fa0\n'`.
  - `HUBS.map(h => h.slug)` equals `['gpa','chemistry','test-prep','statistics']`.
- [ ] **Step 2:** Run `npm test`. Both tests should FAIL with a module not found error.
- [ ] **Step 3:** Implement `config/site.ts`, `config/hubs.ts` and `config/ads.ts`. `config/ads.ts` exports `ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT`, the slot ids per placement from env, and `adsTxt`.
  - `app/ads.txt/route.ts` returns 404 when `adsTxt` is null.
  - `AdSlot` returns `null` with no client. With a client, it renders an `<ins class="adsbygoogle">` with `data-ad-format="auto"` and pushes on mount.
  - `AdsenseScript` loads `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=…` only when the client is set.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Build the header (logo text, hub links from `HUBS`, theme toggle, mobile nav), footer (hub links plus legal links) and layout. The layout includes `<Analytics />` from `@vercel/analytics/next` (add the dependency) and `AdsenseScript`. Add `@media print` rules in `globals.css` that hide the header, footer, nav and ad slots, so pages print cleanly (spec: printable pages).
- [ ] **Step 6:** Write the six site pages with real, specific, original copy:
  - **About:** who Arslan Sarwar is, why the site exists, and how formulas and data are checked. Claim no academic credentials.
  - **Editorial policy:** official sources only, the "last checked" dates, how to report an error, and the 12-month re-check rule.
  - **Privacy:** calculations run in the browser, there are no accounts, and there's Vercel Analytics. It must also say that Google AdSense may use cookies once enabled, with a link to Google's partner-sites policy and opt-out info.
  - **Terms and Disclaimer:** "for learning and checking, not official; confirm with your school/registrar/testing agency".
  - **Contact:** the `ContactForm` adapted from calculate-finance.
- [ ] **Step 7:** Run `npm run build`. Expected: PASS. Each site page also needs metadata with a canonical URL.
- [ ] **Step 8:** Commit: `feat: site shell, SEO helpers, ad slots, site pages`.

### Task 3: Tool registry and shared tool-page template

**Files:**
- Create:
  - Shared lib: `lib/steps.ts`, `lib/result.ts`, `lib/input.ts`, `lib/content/read-content.ts`
  - Tool config: `config/tools/types.ts`, `config/tools/index.ts`
  - Tool components: `components/tools/{tool-page,learning-note,steps-list,faq-section,related-tools,sources-list,number-field}.tsx`, `components/tools/instances.ts`, `components/content/mdx-components.tsx`
  - Hub index pages: `app/{gpa,chemistry,statistics,test-prep}/page.tsx`
  - Tool routes: `app/{gpa,chemistry,statistics,test-prep}/[tool]/page.tsx`
- Test: `tests/lib/input.test.ts`, `tests/config/registry.test.ts`, `tests/content/tool-content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // config/tools/types.ts
  export interface ToolFaq { question: string; answer: string }
  export interface ToolConfig {
    slug: string; hub: HubSlug; name: string; shortName: string
    summary: string            // one sentence
    updated: string            // YYYY-MM-DD
    faqs: ToolFaq[]            // ≥ 4
    related: string[]          // tool slugs OR site paths starting with '/'
    sources: { label: string; url: string }[]
    seo: { title: string; description: string; keywords: string[] }
  }
  // config/tools/index.ts
  export const TOOLS: ToolConfig[]
  export function getTool(hub: HubSlug, slug: string): ToolConfig | undefined
  export function toolsInHub(hub: HubSlug): ToolConfig[]
  export function toolPath(t: ToolConfig): string   // `/${hub}/${slug}`
  // lib/input.ts
  export function parseNumberInput(raw: string): Result<number>  // trims, rejects '', non-numeric, '1,200' → error 'Remove commas', NaN/Infinity
  // components/tools/instances.ts
  export const TOOL_COMPONENTS: Record<string, React.ComponentType>
  // lib/content/read-content.ts
  export function readToolContent(slug: string): Promise<string>
  ```
- **`ToolPage` layout,** shared by every hub's `[tool]` route, in this order:
  1. Breadcrumbs
  2. H1 + summary + byline with the updated date
  3. Calculator component
  4. `LearningNote`
  5. `AdSlot after-result`
  6. MDX article (with `AdSlot in-content` after its first section)
  7. FAQ section
  8. Sources
  9. Related tools
  10. `AdSlot end-of-page`

  It also emits JSON-LD for WebApplication, BreadcrumbList and FAQPage.

- [ ] **Step 1:** Write the failing tests.
  - `tests/lib/input.test.ts`:
    - `parseNumberInput('')` returns ok:false.
    - `'abc'` returns ok:false.
    - `'1,200'` returns ok:false with an error containing `comma`.
    - `' 2.5 '` returns `{ok:true, value:2.5}`.
    - `'-3'` returns -3.
    - `'1e3'` returns 1000.
  - `tests/config/registry.test.ts`:
    - Slugs are unique within each hub.
    - Every `related` slug resolves via `TOOLS`, or starts with `/`.
    - Every tool has ≥4 FAQs, each ending in `?`.
    - Every tool has ≥1 source.
    - Every tool has a component in `TOOL_COMPONENTS`.
    - `seo.title.length <= 60` and `seo.description.length <= 160`.
  - `tests/content/tool-content.test.ts`: every tool's MDX contains the headings `## How it works`, `## Worked example`, `## When to use this` and `## Common mistakes`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL. The registry tests pass vacuously while `TOOLS` is empty, which is fine. Add `expect(TOOLS.length).toBeGreaterThan(0)` so the registry suite fails until Task 6.
- [ ] **Step 3:** Implement the files above. Each hub's `[tool]/page.tsx` has three parts:
  - `generateStaticParams` from `toolsInHub(hub)`
  - `generateMetadata` with the canonical `toolPath`
  - `dynamicParams = false`

  Each hub index page lists `toolsInHub` plus the hub's data pages, taken from a `HUB_EXTRA_LINKS` constant in `config/hubs.ts`:
  - gpa: Latin honors and high school credits
  - test-prep and statistics: none
- [ ] **Step 4:** Run `npm test -- tests/lib/input.test.ts`. Expected: PASS. The registry "non-empty" test stays failing until Task 6, and that's expected.
- [ ] **Step 5:** Commit: `feat: tool registry and shared tool page template`.

### Task 4: Data schemas, loaders and freshness check

**Files:**
- Create: `lib/data/schema.ts`, `lib/data/colleges.ts`, `lib/data/states.ts`, `lib/data/freshness.ts`, `scripts/check-freshness.mjs`, `docs/data-recheck-runbook.md`
- Modify: `package.json`, adding `"prebuild": "node scripts/check-freshness.mjs"`
- Test: `tests/data/schema.test.ts`, `tests/data/freshness.test.ts`, `tests/data/fixtures/*.json`

**Interfaces:**
- Produces:
  ```ts
  export const SourceSchema = z.object({ label: z.string().min(1), url: z.url() })
  export const CollegeSchema = z.object({
    slug, name, shortName, state: z.string().length(2),
    sources: z.array(SourceSchema).min(1), lastChecked: isoDate,
    scale: z.array(z.object({ letter: z.string(), points: z.number().min(0).max(4.3) })).min(5),
    scaleNotes: z.array(z.string()),           // e.g. "A+ counts as 4.0", "P/NP not in GPA"
    nonGpaGrades: z.array(z.string()),         // e.g. ['P','NP','I','W','NR']
    honors: z.object({
      basis: z.enum(['fixed', 'percentile']),
      academicYear: z.string().optional(),     // required when basis = 'percentile' (refine)
      rule: z.string().min(20),                // plain-English rule
      schools: z.array(z.object({
        name: z.string(),                      // 'All undergraduates' when one set applies
        cumLaude: z.number().optional(), magnaCumLaude: z.number().optional(), summaCumLaude: z.number().optional(),
        extraRequirements: z.array(z.string()).default([]),
      })).min(1),
    }),
    deansList: z.string().optional(),
  })
  export const StateSchema = z.object({
    slug, name, abbr: z.string().length(2),
    sources: z.array(SourceSchema).min(1), lastChecked: isoDate,
    appliesToClassOf: z.string(),              // e.g. '2026 and later'
    plans: z.array(z.object({
      name: z.string(), totalCredits: z.number().positive(),
      subjects: z.array(z.object({ key: z.string(), label: z.string(), credits: z.number().nonnegative(), notes: z.string().optional() })).min(3),
      notes: z.string().optional(),
    })).min(1),                                // refine: sum(subjects.credits) ≤ totalCredits (remainder = electives)
    otherRequirements: z.array(z.string()),    // exams, community service, etc.
    districtNote: z.string().min(20),
  })
  export type College = z.infer<typeof CollegeSchema>; export type State = z.infer<typeof StateSchema>
  // loaders: read data/colleges/*.json or data/states/*.json, parse (throws with file name on error), sort by name
  export function getColleges(): College[]; export function getCollege(slug: string): College | undefined
  export function getStates(): State[];     export function getState(slug: string): State | undefined
  // freshness
  export function staleRecords(records: { slug: string; lastChecked: string }[], today: Date, maxDays = 365): string[]
  ```
- `scripts/check-freshness.mjs` reads every JSON file in `data/`, prints `⚠ stale data: <file> (last checked <date>)` for each stale record, and **exits 0**, because the check only warns.

- [ ] **Step 1:** Write the failing tests using the fixtures:
  - A valid college fixture parses.
  - A percentile college without `academicYear` fails.
  - A state whose subject credits sum above `totalCredits` fails.
  - A source with a non-URL fails.
  - `staleRecords([{slug:'a', lastChecked:'2025-01-01'}], new Date('2026-11-04'))` returns `['a']`.
  - `lastChecked:'2026-06-01'` returns `[]`.
- [ ] **Step 2:** Run `npm test -- tests/data`. Expected: FAIL.
- [ ] **Step 3:** Implement the schemas, loaders, freshness helper, script and runbook. The runbook covers how to re-check one college or state, where its sources are, how to update `lastChecked`, and the yearly checks:
  - August for percentile honors
  - September for state graduation rules
  - September for NMSQT cutoffs
- [ ] **Step 4:** Run `npm test -- tests/data`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: data schemas, loaders, freshness check`.

### Task 5: GPA and credits math

**Files:**
- Create: `lib/gpa/scale.ts`, `lib/gpa/term-gpa.ts`, `lib/gpa/honors.ts`, `lib/credits/remaining.ts`
- Test: `tests/gpa/*.test.ts`, `tests/credits/remaining.test.ts`

**Interfaces:**
- Consumes: `Step`, `Result` and the `College['honors']['schools'][number]` and `State['plans'][number]` types from Task 4.
- Produces:
  ```ts
  export interface ScaleRow { letter: string; points: number; minPercent: number }
  export const STANDARD_SCALE: ScaleRow[]
  // A+ 4.0 97 | A 4.0 93 | A- 3.7 90 | B+ 3.3 87 | B 3.0 83 | B- 2.7 80 | C+ 2.3 77 | C 2.0 73 | C- 1.7 70 | D+ 1.3 67 | D 1.0 65 | F 0 0
  export function letterToPoints(letter: string, scale?: { letter: string; points: number }[]): number | null  // case-insensitive, trims
  export function percentToLetter(percent: number, scale?: ScaleRow[]): string
  export function pointsToLetter(points: number, scale?: { letter: string; points: number }[]): string  // highest letter whose points ≤ input
  export function termGpa(courses: { grade: string; units: number }[], scale: { letter: string; points: number }[], nonGpaGrades: string[]):
    Result<{ gpa: number; totalPoints: number; totalUnits: number; excluded: string[]; steps: Step[] }>
  export type HonorLevel = 'summa cum laude' | 'magna cum laude' | 'cum laude'
  export function qualifyHonors(gpa: number, cutoffs: { cumLaude?: number; magnaCumLaude?: number; summaCumLaude?: number }): HonorLevel | null
  export function creditsRemaining(plan: State['plans'][number], earned: Record<string, number>):
    { totalRequired: number; totalEarned: number; totalRemaining: number; bySubject: { key: string; label: string; required: number; earned: number; remaining: number }[] }
  ```

- [ ] **Step 1:** Write the failing tests.
  - **Grade conversion:**
    - `letterToPoints(' b+ ')` returns 3.3.
    - `letterToPoints('A+')` returns 4.0.
    - `letterToPoints('P')` returns null.
    - `percentToLetter(89.9)` returns 'B+'.
    - `percentToLetter(90)` returns 'A-'.
    - `percentToLetter(64)` returns 'F'.
    - `pointsToLetter(3.5)` returns 'B+'.
  - **termGpa:**
    - It reproduces UCLA's published example: three 4-unit courses graded A-, B- and C+. Expected: totalPoints 34.8, totalUnits 12, gpa 2.9.
    - Courses `[{A,4},{P,4},{W,3}]` with nonGpaGrades `['P','W']` give gpa 4.0, totalUnits 4 and excluded `['P','W']`.
    - All courses being non-GPA grades returns ok:false.
    - Units ≤ 0 returns ok:false.
    - A grade not on the scale (e.g. `'Q'`) returns ok:false, with an error naming `Q`.
  - **qualifyHonors:**
    - `qualifyHonors(3.8, {cumLaude:3.6, magnaCumLaude:3.8, summaCumLaude:3.9})` returns 'magna cum laude' (cutoffs are inclusive).
    - 3.59 returns null.
    - With only `cumLaude` defined, 3.95 returns 'cum laude'.
  - **creditsRemaining:**
    - A plan of 22 total with English 4 and Math 4, and earned `{english:4, math:2}`: math remaining is 2, english remaining is 0, and totalRemaining is `22 − 6 = 16`.
    - Earned above required never gives a negative remaining.
- [ ] **Step 2:** Run `npm test -- tests/gpa tests/credits`. Expected: FAIL.
- [ ] **Step 3:** Implement. Round the GPA to 2 decimals for display only, and keep the full precision value in the `steps`. `totalEarned` counts every earned credit, including credits above a subject's requirement, which count as electives, capped at `totalCredits`.
- [ ] **Step 4:** Run the same test command. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: GPA, honors and credits math`.

### Task 6: Grade converter tool (first tool, end to end)

**Files:**
- Create: `config/tools/grade-converter.ts`, `components/tools/grade-converter/grade-converter-tool.tsx`, `content/tools/grade-converter.mdx`
- Modify: `config/tools/index.ts`, `components/tools/instances.ts`

**Interfaces:**
- Consumes: Task 3's `ToolConfig`, `parseNumberInput` and `NumberField`, and Task 5's `STANDARD_SCALE`, `percentToLetter`, `letterToPoints` and `pointsToLetter`.
- Route: `/gpa/grade-converter`.
- SEO title: `Letter Grade to GPA & Percentage Converter | StudentCalcHub`.
- Keywords: letter grade to gpa, gpa to percentage, letter grade chart, percent to letter grade.

- [ ] **Step 1:** Build the tool as a Radix tab or segmented control with three modes:
  - Percent → letter + points
  - Letter → points + percent range
  - GPA → letter + approximate percent

  Each mode shows its steps. Below the tool, show the full scale table. State plainly that schools set their own cutoffs, and link to `/gpa/latin-honors` and the college pages.
- [ ] **Step 2:** Write the MDX with the four required headings plus `## Sources`. Use College Board's "How to convert your GPA to a 4.0 scale" page as a source.
- [ ] **Step 3:** Run `npm test`. The registry and content tests should now PASS, including the non-empty test.
- [ ] **Step 4:** Run `npm run dev` and open `/gpa/grade-converter`. Check that typing 89.9 shows B+, a blank input shows a message, and the layout works at 375px width.
- [ ] **Step 5:** Commit: `feat: grade converter tool`.

### Task 7: College data and the college and Latin honors pages

**Files:**
- Create:
  - Data: `data/colleges/<slug>.json` (target 15)
  - Routes: `app/gpa/college/[college]/page.tsx`, `app/gpa/latin-honors/page.tsx`
  - Components: `components/data/term-gpa.tsx`, `components/data/college-honors-checker.tsx`
- Test: `tests/data/colleges.test.ts`

**Interfaces:**
- Consumes: `getColleges` and `getCollege` (Task 4), and `termGpa` and `qualifyHonors` (Task 5).
- Produces: the routes `/gpa/college/[slug]` (`dynamicParams = false`) and `/gpa/latin-honors`.

- [ ] **Step 1: Research.** For each college, take the values from the official registrar, catalog or bulletin pages only, using WebFetch:
  - Grade-point scale and non-GPA grades
  - Latin honors rule and cutoffs per school
  - Dean's list rule, if published

  Start with the colleges in the spec's list: UCLA, UC Berkeley, Michigan, UT Austin, Florida, Ohio State, Penn State, NYU, Washington, UNC Chapel Hill, Minnesota, UMass Amherst, Tulane, Arizona State and SNHU.
  - Record every source URL, and set `lastChecked` to today.
  - For percentile schools (e.g. UCLA, UMass), store the latest published year's cutoffs with `academicYear`.
  - If a college doesn't publish honors cutoffs or its scale officially, swap in another large US university that does.
  - Only stop at fewer than 12 colleges if you report it.
- [ ] **Step 2:** Write `tests/data/colleges.test.ts`:
  - `getColleges().length >= 12`
  - Every slug matches `/^[a-z0-9-]+$/`.
  - Every college has cutoffs in the order cum < magna < summa wherever defined.
  - Every `lastChecked` is ≤ today.
- [ ] **Step 3:** Run `npm test -- tests/data/colleges.test.ts`. Expected: PASS once the data is in.
- [ ] **Step 4:** Build the college page.
  - **Title:** `{shortName} GPA Scale & Latin Honors Requirements`
  - **Sections, in order:**
    1. Grade-point table
    2. Scale notes
    3. Term GPA calculator (`TermGpa` with the college's scale and non-GPA grades, add/remove course rows)
    4. Latin honors cutoffs table per school, with the rule text and, for percentile schools, "Based on {academicYear} cutoffs; next year's may differ."
    5. "Do I qualify?" checker
    6. Dean's list
    7. Sources with last-checked date
    8. Related colleges in the same state, else 3 others
    9. Learning note and ad slots per the Task 3 order
  - **JSON-LD:** BreadcrumbList and WebPage.
  - Write a unique 2–3 sentence intro per college from its data, e.g. honors basis, number of schools, A+ policy, so the pages aren't templated clones.
- [ ] **Step 5:** Build `/gpa/latin-honors`. It contains:
  - Explainer copy: what cum laude, magna and summa mean, plus the fixed vs percentile explanation.
  - A comparison table with one row per college. Show `varies by school` where there's more than one school, and link each row to its college page.
  - A general "do I qualify?" checker: pick a college, and a school if needed, enter a GPA, and get a result.
  - FAQ with ≥4 entries and FAQPage JSON-LD.
- [ ] **Step 6:** Run `npm run build`. It should generate every college page. Then check `/gpa/college/ucla` in the dev server.
- [ ] **Step 7:** Commit: `feat: college GPA scale and Latin honors pages with verified data`.

### Task 8: State data and the high school credits pages

**Files:**
- Create: `data/states/<slug>.json` (target 10), `app/high-school-credits/page.tsx`, `app/high-school-credits/[state]/page.tsx`, `components/data/credits-remaining.tsx`
- Test: `tests/data/states.test.ts`

**Interfaces:**
- Consumes: `getStates` and `getState` (Task 4), and `creditsRemaining` (Task 5).
- Produces: the routes `/high-school-credits` and `/high-school-credits/[slug]`, with slugs like `texas` and `new-york`.

- [ ] **Step 1: Research** from state education department pages, statute or administrative code only, for the current graduating class.
  - Start with TX, FL, GA, NY, NC and SC.
  - For CA, PA, OH and IL, include a state only if its statewide minimum can be stated accurately. Otherwise use VA, NJ, MI or TN.
  - Model every diploma plan the state defines, e.g. TX Foundation / Foundation + Endorsement / Distinguished, and NY Regents / Advanced Regents.
  - Put non-credit rules in `otherRequirements`, such as exit exams, civics tests and FAFSA.
- [ ] **Step 2:** Write `tests/data/states.test.ts`:
  - `getStates().length >= 8`
  - Unique abbreviations
  - Every plan has `totalCredits` between 13 and 30
- [ ] **Step 3:** Run `npm test -- tests/data/states.test.ts`. Expected: PASS.
- [ ] **Step 4:** Build the state page.
  - **Title:** `How Many Credits to Graduate High School in {State}? ({appliesToClassOf})`
  - **Sections:**
    - A direct answer in the first sentence
    - Plan tabs, each with a subject table and electives remainder
    - Other requirements
    - The district note in a callout
    - The `CreditsRemaining` calculator: pick a plan, enter earned credits per subject, and see what's left per subject and in total
    - Sources with last-checked date
    - Links to other states
    - FAQ with ≥4 entries, generated from the data plus written copy
  - Build the overview page with a table of all states (total credits per plan) and a short explainer.
- [ ] **Step 5:** Run `npm run build`. Expected: PASS.
- [ ] **Step 6:** Commit: `feat: high school credits by state with verified data`.

### Task 9: Sig fig and percent error math and tools

**Files:**
- Create: `lib/chemistry/sig-figs.ts`, `lib/chemistry/percent-error.ts`, `config/tools/{sig-fig-calculator,percent-error-calculator}.ts`, `components/tools/{sig-fig-calculator,percent-error-calculator}/*-tool.tsx`, `content/tools/{sig-fig-calculator,percent-error-calculator}.mdx`
- Modify: `config/tools/index.ts`, `components/tools/instances.ts`
- Test: `tests/chemistry/sig-figs.test.ts`, `tests/chemistry/percent-error.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export function countSigFigs(input: string): Result<{ count: number; decimalPlaces: number | null; ambiguous: boolean; steps: Step[] }>
  // accepts '0.00450', '1500', '1500.', '1.50e3', '1.50E-3', '1.50 x 10^3', '1.50×10^3', leading +/-; rejects '', '1.2.3', 'abc'
  export function roundToSigFigs(value: number, n: number): { fixed: string; scientific: string }  // keeps trailing zeros
  export function sigFigArithmetic(op: '+' | '-' | '*' | '/', a: string, b: string): Result<{ raw: number; rounded: string; rule: string; steps: Step[] }>
  export function percentError(i: { experimental: number; accepted: number; signed?: boolean; sigFigs?: number }):
    Result<{ value: number; display: string; absoluteError: number; steps: Step[] }>
  ```

- [ ] **Step 1:** Write the failing tests.
  - **countSigFigs:**
    - `'0.00450'` gives 3.
    - `'1500'` gives 2, with ambiguous true.
    - `'1500.'` gives 4, with ambiguous false.
    - `'1.500e3'` gives 4.
    - `'1.50 x 10^3'` gives 3.
    - `'100.0'` gives 4.
    - `'0'` gives 1.
    - `'1.2.3'` returns ok:false.
  - **roundToSigFigs:**
    - `(2, 3)` gives fixed `'2.00'`.
    - `(1234, 2)` gives fixed `'1200'` and scientific `'1.2 × 10^3'`.
    - `(0.0045678, 2)` gives fixed `'0.0046'`.
  - **sigFigArithmetic:**
    - `('+','12.11','0.3')` gives rounded `'12.4'`, using the least-decimal-places rule.
    - `('*','2.5','3.47')` gives rounded `'8.7'`, using the least-sig-figs rule.
  - **percentError:**
    - `{experimental:52.3, accepted:50.0}` gives value 4.6 to 2 decimal places.
    - `signed:true` with experimental 47.7 gives -4.6.
    - `sigFigs:2` gives display `'4.6%'`.
    - `accepted:0` returns ok:false with an error containing `percent difference`.
- [ ] **Step 2:** Run `npm test -- tests/chemistry`. Expected: FAIL.
- [ ] **Step 3:** Implement. Parse sig figs from the **string**, never from a JS number, so trailing zeros survive.
- [ ] **Step 4:** Run `npm test -- tests/chemistry`. Expected: PASS.
- [ ] **Step 5:** Build the tools.
  - **Sig figs:** three modes (count, round, arithmetic), with the ambiguous-zero explanation shown when flagged.
  - **Percent error:** a signed/unsigned toggle and an optional sig-fig rounding select, with "auto" matching the least precise input via `countSigFigs`.
  - Write MDX for both, with sources from university chemistry department or OpenStax Chemistry pages.
  - **Keywords for percent error:** percent error calculator, chemistry, with sig figs, physics.
  - **Keywords for sig figs:** sig fig calculator, addition, scientific notation, rounding.
- [ ] **Step 6:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 7:** Commit: `feat: sig fig and percent error calculators`.

### Task 10: Formula parser, molar mass, grams↔moles and molarity tools

**Files:**
- Create: `lib/chemistry/elements.ts`, `lib/chemistry/formula.ts`, `lib/chemistry/molarity.ts`, `config/tools/{grams-to-moles-calculator,molarity-calculator}.ts`, the matching components and MDX
- Test: `tests/chemistry/formula.test.ts`, `tests/chemistry/molarity.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export const ATOMIC_MASSES: Record<string, number>   // IUPAC conventional/abridged standard atomic weights, elements 1–103; cite IUPAC CIAAW in a comment
  export const AVOGADRO = 6.02214076e23
  export function parseFormula(formula: string): Result<Record<string, number>>
  // supports nested () and [], hydrates with '·', '*', or '.' separator and leading coefficient ('5H2O'); whitespace ignored
  export function molarMass(formula: string): Result<{ value: number; breakdown: { element: string; count: number; atomicMass: number; subtotal: number }[]; steps: Step[] }>
  export function gramsToMoles(grams: number, molarMass: number): Result<{ moles: number; particles: number; steps: Step[] }>
  export function molesToGrams(moles: number, molarMass: number): Result<{ grams: number; steps: Step[] }>
  export function molarity(i: { moles?: number; grams?: number; formula?: string; volumeL: number }): Result<{ molarity: number; steps: Step[] }>
  export function solveDilution(i: { c1?: number; v1?: number; c2?: number; v2?: number }):
    Result<{ solvedFor: 'c1' | 'v1' | 'c2' | 'v2'; value: number; warning?: string; steps: Step[] }>
  ```

- [ ] **Step 1:** Write the failing tests.
  - **molarMass:**
    - `'H2O'` gives ≈18.015 (±0.01).
    - `'NaCl'` gives ≈58.44.
    - `'Ca(OH)2'` gives ≈74.09.
    - `'CuSO4·5H2O'`, `'CuSO4*5H2O'` and `'CuSO4.5H2O'` all give ≈249.68.
    - `'C6H12O6'` gives ≈180.16.
    - `'K4[Fe(CN)6]'` gives ≈368.35.
  - **parseFormula errors:**
    - `'co2'` returns ok:false, with an error containing `capital`.
    - `'Xx2'` returns ok:false, with an error containing `Xx`.
    - `'Ca(OH'` returns ok:false, with an error containing `parenthes`.
    - `''` returns ok:false.
  - **gramsToMoles:**
    - `(36.03, 18.015)` gives moles ≈2.000 and particles ≈1.2044e24.
    - A molar mass of 0 returns ok:false.
  - **solveDilution:**
    - `{c1:2, v1:0.05, c2:0.5}` gives v2 0.2.
    - Providing all four values, or fewer than three, returns ok:false.
    - A zero value returns ok:false.
    - `{c1:1, v1:1, v2:0.5}` gives c2 2 with a `warning` that the concentration increased, i.e. this isn't a dilution.
  - **molarity:**
    - `{grams:5.844, formula:'NaCl', volumeL:0.5}` gives ≈0.2.
    - `volumeL:0` returns ok:false.
- [ ] **Step 2:** Run `npm test -- tests/chemistry`. Expected: FAIL.
- [ ] **Step 3:** Implement. The parser is a recursive descent over tokens:
  - Element: `[A-Z][a-z]?`
  - Number
  - `(`, `)`, `[`, `]`
  - Hydrate separator

  An all-lowercase input that would be valid when uppercased gets the capitalization hint.
- [ ] **Step 4:** Run the tests again. Expected: PASS.
- [ ] **Step 5:** Build the two tools.
  - **Grams to moles:** formula input with a live molar mass breakdown table; direction toggle grams→moles→particles or moles→grams; steps.
  - **Molarity:** tabs for "Molarity" and "Dilution (M1V1 = M2V2)", where the user leaves one field blank to solve it; a unit select for mL or L.
  - Write MDX for both.
  - Add `/chemistry/molar-mass` content inside the grams-to-moles MDX. Don't create a separate tool.
- [ ] **Step 6:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 7:** Commit: `feat: molar mass, grams to moles and molarity calculators`.

### Task 11: Statistical test chooser

**Files:**
- Create: `lib/statistics/test-chooser.ts`, `config/tools/which-statistical-test.ts`, `components/tools/which-statistical-test/which-statistical-test-tool.tsx`, `content/tools/which-statistical-test.mdx`
- Test: `tests/statistics/test-chooser.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ChooserQuestion { id: string; text: string; help: string; options: { label: string; next: string }[] }  // next = question id or result id
  export interface ChooserResult { id: string; test: string; alternative?: string; assumptions: string[]; example: string; whenNot: string }
  export const START_ID: string
  export const QUESTIONS: Record<string, ChooserQuestion>
  export const RESULTS: Record<string, ChooserResult>
  export function walk(answers: number[]): { path: ChooserQuestion[]; result: ChooserResult | null }  // answers = option indexes from START
  ```
- The tree covers these goals:
  - Compare groups
  - Relationship between two variables
  - Predict an outcome
  - Fit to an expected distribution

  The branches ask about:
  - Outcome type: continuous, ordinal or categorical
  - Number of groups: 1, 2 or 3+
  - Paired/repeated vs independent
  - Roughly normal or n ≥ 30 per group vs not
  - Expected counts ≥ 5

  It ends in these results: one-sample t, independent t (note Welch), Mann–Whitney U, paired t, Wilcoxon signed-rank, one-way ANOVA, Kruskal–Wallis, repeated-measures ANOVA, Friedman, chi-square test of independence, Fisher's exact, McNemar, chi-square goodness of fit, Pearson r, Spearman ρ, simple linear regression, multiple regression and logistic regression.

- [ ] **Step 1:** Write the failing tests:
  - Every `next` resolves to a question or a result.
  - Every result is reachable.
  - There are no cycles (DFS from `START_ID`).
  - Every path ends in a result within 6 answers.
  - Compare groups → continuous → 2 groups → independent → normal gives `independent t-test`.
  - The same path with not normal gives `Mann–Whitney U`.
  - Categorical, 2 variables, expected counts < 5 gives `Fisher's exact test`.
- [ ] **Step 2:** Run `npm test -- tests/statistics`. Expected: FAIL.
- [ ] **Step 3:** Implement the tree data and `walk`.
- [ ] **Step 4:** Run the same test command. Expected: PASS.
- [ ] **Step 5:** Build the tool.
  - Show one question at a time with plain-language help, a breadcrumb of the previous answers (each clickable to go back), and a "start over" button.
  - The result card shows the test, its alternative, assumptions, an example and "when not to use it".
  - Add a printable full flowchart in the MDX as a nested list generated from the same data. Add a `print:` stylesheet so the page prints cleanly.
  - **Keywords:** which statistical test should i use, flowchart, t-test vs chi-square.
- [ ] **Step 6:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 7:** Commit: `feat: statistical test chooser`.

### Task 12: Sample size calculator

**Files:**
- Create: `lib/statistics/sample-size.ts`, `config/tools/sample-size-calculator.ts`, the matching component and MDX
- Test: `tests/statistics/sample-size.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export const Z_SCORES: Record<'80' | '85' | '90' | '95' | '98' | '99', number>  // 1.2816, 1.4395, 1.6449, 1.9600, 2.3263, 2.5758
  export function sampleSizeProportion(i: { confidence: keyof typeof Z_SCORES; marginOfError: number /* 0.05 */; p?: number /* default 0.5 */; population?: number }):
    Result<{ n: number; nInfinite: number; steps: Step[] }>
  export function sampleSizeMean(i: { confidence: keyof typeof Z_SCORES; marginOfError: number; sd: number; population?: number }):
    Result<{ n: number; nInfinite: number; steps: Step[] }>
  // n0 = z²·p(1−p)/E² (or (z·σ/E)²); FPC n = n0 / (1 + (n0 − 1)/N); final n = ceil
  ```

- [ ] **Step 1:** Write the failing tests:
  - 95%, E 0.05, default p gives n 385.
  - The same with population 1000 gives 278.
  - 99%, E 0.03 gives 1843.
  - Mean: 95%, E 2, sd 10 gives 97.
  - E 0, E ≥ 1 (proportion), p outside (0,1), sd ≤ 0 or population < 1 each return ok:false.
- [ ] **Step 2:** Run `npm test -- tests/statistics`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the same test command. Expected: PASS.
- [ ] **Step 5:** Build the tool.
  - Proportion/mean tabs, a confidence select, margin of error as a % input, an optional population, and steps.
  - The MDX explains why p = 0.5 is the safe default.
  - **Keywords:** sample size calculator, for survey, formula, with standard deviation.
- [ ] **Step 6:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 7:** Commit: `feat: sample size calculator`.

### Task 13: Test prep estimators (SAT, PSAT/NMSQT, ACT)

**Files:**
- Create:
  - Lib and data: `lib/test-prep/{sat,psat,act}.ts`, `data/test-prep/nmsqt-cutoffs.json`, `lib/data/nmsqt.ts` (zod schema + loader)
  - Tool config: `config/tools/{sat-score-calculator,psat-score-calculator,act-score-calculator}.ts`
  - Components and content: components and MDX for the three tools
- Test: `tests/test-prep/*.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ScoreRange { low: number; mid: number; high: number }
  // sat.ts — digital SAT: Reading & Writing 54 questions, Math 44; section 200–800, steps of 10
  export function estimateSat(i: { rwCorrect: number; mathCorrect: number }): Result<{ rw: ScoreRange; math: ScoreRange; total: ScoreRange }>
  // psat.ts — PSAT/NMSQT: same question counts; section 160–760, total 320–1520
  export function estimatePsat(i: { rwCorrect: number; mathCorrect: number }): Result<{ rw: ScoreRange; math: ScoreRange; total: ScoreRange }>
  export function selectionIndex(rw: number, math: number): number   // (2·rw + math) / 10, range 48–228
  // act.ts — enhanced ACT: English 50, Math 45, Reading 36, Science 40 (optional); each 1–36
  export function estimateActSection(section: 'english' | 'math' | 'reading' | 'science', correct: number): Result<ScoreRange>
  export function actComposite(english: number, math: number, reading: number): number  // mean of the three, .5 rounds up
  export function actStem(math: number, science: number): number
  // nmsqt.ts
  export const NmsqtCutoffSchema  // { classOf: string; testYear: string; sources: Source[]; lastChecked; cutoffs: { state: string; index: number }[] }
  ```
- **Curves:** Use our own monotonic piecewise-linear curves anchored at a few points per section, derived from publicly reported practice-test score ranges. Set the range width so `high − low` is between 40 and 80 points for SAT and PSAT sections, and between 2 and 4 for ACT. Document the method in each tool's MDX `## How it works`. Don't embed a copied official table.

- [ ] **Step 1:** Write the failing tests.
  - **Bounds:** 0 correct gives the section minimum, and all correct gives the maximum (SAT 200/800, PSAT 160/760, ACT 1/36).
  - **Monotonic:** the mid value is monotonic non-decreasing across every correct count.
  - **Steps of 10:** SAT and PSAT values are multiples of 10.
  - **Out of range:** an out-of-range count returns ok:false. Examples: `rwCorrect: 55` or `-1`.
  - **Selection index:** `selectionIndex(700, 700)` gives 210, and `selectionIndex(760, 760)` gives 228.
  - **ACT composite:** `actComposite(30,31,32)` gives 31, `(30,31,31)` gives 31, and `(30,30,31)` gives 30. `actStem(30,31)` gives 31.
- [ ] **Step 2:** Run `npm test -- tests/test-prep`. Expected: FAIL.
- [ ] **Step 3:** Implement the curves and functions.
- [ ] **Step 4:** Run the same test command. Expected: PASS.
- [ ] **Step 5:** Research the National Merit state Selection Index cutoffs for the most recent class (`classOf`). Use NMSC-published commended or state data, or a reputable tracker that cites NMSC. Store every source, and leave out any state you can't confirm.
- [ ] **Step 6:** Build the three tools.
  - Each shows an **"Estimate"** badge next to every score, plus a sentence explaining why it's an estimate (adaptive testing / varies by test form).
  - **PSAT:** shows the Selection Index and a state select comparing against "Class of {classOf} cutoff (past)".
  - **ACT:** a "Include science" toggle that shows the STEM score.
  - **Keywords:** sat score calculator 2026 digital; psat score calculator for national merit; act score calculator without science.
- [ ] **Step 7:** Run `npm test && npm run build`. Expected: PASS.
- [ ] **Step 8:** Commit: `feat: SAT, PSAT and ACT score estimators`.

### Task 14: Homepage, sitemap and internal links

**Files:**
- Modify: `app/page.tsx`, `config/hubs.ts`
- Create: `app/sitemap.ts`, `config/featured.ts`
- Test: `tests/seo/sitemap.test.ts`

**Interfaces:**
- Consumes: `TOOLS`, `toolPath`, `getColleges`, `getStates` and `HUBS`.
- Produces: `FEATURED = ['/gpa/grade-converter', '/gpa/latin-honors', '/high-school-credits']`, which is the spec's homepage lead order.

- [ ] **Step 1:** Write the failing test for `sitemap()`:
  - It includes `/`, every hub index, every `toolPath`, `/gpa/latin-honors`, `/high-school-credits`, every `/gpa/college/{slug}` and every `/high-school-credits/{slug}`, plus the six site pages.
  - No duplicates.
  - Every URL is absolute and starts with `SITE.url`.
- [ ] **Step 2:** Run `npm test -- tests/seo`. Expected: FAIL.
- [ ] **Step 3:** Implement `sitemap.ts`, using each record's `lastChecked` or `updated` as `lastModified`.
- [ ] **Step 4:** Run the same test command. Expected: PASS.
- [ ] **Step 5:** Build the homepage, in this order:
  1. Hero: one line on what the site is, plus the learning note
  2. GPA & Graduation featured cards (the 3 `FEATURED` items)
  3. Popular colleges and states chips
  4. Chemistry, Test Prep and Statistics hub sections, each listing its tools

  Add Organization and WebSite JSON-LD. Make sure every college and state page links to at least 3 sibling pages, and each hub index links to all its tools.
- [ ] **Step 6:** Run `npm run build`. Expected: PASS.
- [ ] **Step 7:** Commit: `feat: homepage, sitemap, internal linking`.

### Task 15: End-to-end smoke test and launch checks

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `README.md`

- [ ] **Step 1:** Write `e2e/smoke.spec.ts`. It runs against `npm run build && npm start` through the Playwright `webServer` setting.
  - For every URL in `/sitemap.xml`, check:
    - Status 200
    - Exactly one `h1`
    - A `<link rel="canonical">`
    - No console errors
    - No horizontal scroll at 375px width (`scrollWidth <= clientWidth`)
  - Check the learning note text on every tool page.
  - On `/chemistry/percent-error-calculator`, enter accepted `0`. The page shows an error message and no `NaN` or `Infinity` anywhere.
  - On `/gpa/grade-converter`, clear the input. The page shows no `NaN`.
  - Check `/ads.txt` returns 404 when the env var is unset.
- [ ] **Step 2:** Run `npm run test:e2e`. Expected: all pass. Fix anything that fails in the task that owns it.
- [ ] **Step 3:** Run all checks:
  ```
  npm run lint && npm run typecheck && npm test && npm run build
  ```
  Everything should pass, and the freshness check should print no stale warnings.
- [ ] **Step 4:** Write the README:
  - Setup
  - Scripts
  - Env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT` and the `NEXT_PUBLIC_ADSENSE_SLOT_*` variables
  - How to add a tool, a college or a state
  - A link to the data runbook
  - The AdSense application checklist: domain live, all hubs live, Search Console verified, privacy page, enabling Google's CMP for EEA/UK in the AdSense dashboard
- [ ] **Step 5:** Commit: `test: e2e smoke tests; docs: README and launch checklist`.
