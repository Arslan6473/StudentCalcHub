# StudentCalcHub — Design

Date: 2026-11-04 · Domain (to buy): StudentCalcHub.com

## Intent

A free, AdSense-funded website of academic calculators and lookup pages for US high school and college students. It targets search keywords where demand is real but page 1 of Google is weak: official registrar pages only, copied/spam sites, or blog posts with no actual tool (findings from autocomplete + SERP research on 2026-11-04).

The site helps students **check and understand** their own work. It never does their work for them.

## Goals

- Rank for long-tail student searches, starting with the GPA & graduation cluster.
- Get approved by Google AdSense on first application: every page has real, original, useful content.
- Show the working (steps, formula, worked example) on every calculator — this is the differentiator vs. competitors that only show an answer.
- Fast, mobile-first, printable pages.

## Non-goals (v1)

- User accounts, saving data, logins.
- Citation generator, generic GPA calculator, final-grade calculator, standard deviation / p-value calculators (too competitive for a new site — later phases).
- Covering all 50 states / all colleges on day one.

## Anti-goals (would make this a failure even if it works)

- Essay writers, paraphrasers, "AI humanizers", homework answer tools, leaked test content (AdSense rejection + ethics).
- Made-up or guessed data. A wrong cum laude cutoff or credit count is worse than no page. Every data value must cite an official source with a "last checked" date.
- Thin, templated pages that differ only by name (AdSense "low value content").
- Collecting student data. All calculations run in the browser; nothing is sent to a server.

## Who uses it

US students (15–24), mostly on phones, arriving from Google on one specific question ("latin honors gpa ucla", "percent error calculator with sig figs"). They want the answer fast, then they may click a related tool.

## Site structure and v1 content

Homepage leads with the GPA & graduation hub (highest demand, weakest competition), then three more hubs.

### Hub 1 — GPA & Graduation (`/gpa`)
| Page | URL | Notes |
|---|---|---|
| Letter grade ↔ GPA ↔ percentage converter | `/gpa/grade-converter` | Standard 4.0 scale with +/- ; percentage bands shown with the caveat that schools differ |
| Latin honors overview + comparison table | `/gpa/latin-honors` | Table of all v1 colleges' cutoffs; "do I qualify?" input |
| College page: GPA scale + Latin honors | `/gpa/college/[college]` | ~15 colleges in v1. **One combined page per college** (scale table, term GPA calculator on that scale, honors cutoffs, Dean's list rule if published) so each page has enough unique content — no separate near-duplicate scale pages. Targets both "[college] gpa scale" and "[college] latin honors". |
| High school credits to graduate — overview | `/high-school-credits` | Links to states |
| High school credits per state | `/high-school-credits/[state]` | ~10 states in v1 (TX, FL, CA, GA, NY, NC, SC, PA, OH, IL); credit breakdown by subject + plan options + "credits remaining" calculator |

### Hub 2 — Chemistry & Lab (`/chemistry`)
- `/chemistry/percent-error-calculator` (with sig-fig rounding option, signed/unsigned)
- `/chemistry/sig-fig-calculator` (count, round, add/subtract/multiply/divide rules, scientific notation)
- `/chemistry/grams-to-moles-calculator` (formula parser → molar mass from periodic table data, step-by-step; also moles→atoms)
- `/chemistry/molarity-calculator` (molarity + M1V1 = M2V2 dilution)

### Hub 3 — Test Prep (`/test-prep`)
- `/test-prep/psat-score-calculator` (incl. National Merit Selection Index)
- `/test-prep/sat-score-calculator` (digital SAT)
- `/test-prep/act-score-calculator` (composite; with/without science)
- Score conversions must come from official College Board / ACT published tables. Where official raw→scaled tables don't exist (digital adaptive SAT), the page must say the result is an **estimate** and explain why.

### Hub 4 — Statistics (`/statistics`)
- `/statistics/which-statistical-test` — interactive question flow → recommended test (parametric + nonparametric alternative), with assumptions and a printable flowchart
- `/statistics/sample-size-calculator` — proportion & mean, confidence level, margin of error, finite population correction, with steps

### Site pages (AdSense requirements)
About, Contact, Privacy Policy, Terms, Disclaimer ("for learning and checking, not official"), Editorial / data-sources policy, sitemap.xml, robots.txt, 404.

## Every tool page contains

1. H1 + one-line answer of what it does
2. The calculator (client component, instant results, works without page reload)
3. Step-by-step working of the result
4. "How it works" (formula / rules)
5. Worked example
6. "When to use this" and "Common mistakes"
7. FAQ (with FAQPage structured data)
8. Sources (official links) + "Last checked" date for data pages
9. Related tools links
10. Note: "Use this tool to learn and check your work, not to replace your own."
11. Ad slots (placeholders, see below)

## Data

- Colleges and states stored as typed data files in the repo (one file per entity), validated with zod at build time.
- Each record has: values, official source URL(s), last-checked date.
- v1 college list (builder may swap for others with clear public data): UCLA, UC Berkeley, University of Michigan, UT Austin, University of Florida, Ohio State, Penn State, NYU, University of Washington, UNC Chapel Hill, University of Minnesota, UMass Amherst, Tulane, Arizona State, SNHU.
- Data is researched from official registrar / state education department pages during the build. If a value can't be confirmed from an official source, that entity is left out — no guesses.
- Colleges whose honors are percentile-based (cutoff changes yearly per college/school, e.g. UCLA, UMass) show the latest published table and explain the rule.

### Data decisions (builder's calls, made during design review)
- **State credits:** show the **state minimum** for the current graduating class, with diploma/plan variants where the state defines them (e.g. TX Foundation / +Endorsement / Distinguished; NY Regents / Advanced Regents). Every state page says clearly that districts may require more. Schema supports multiple plans and a "applies to class of" field. States where the state sets almost nothing (likely CA, PA, OH, IL) are only included if the state's own minimum can be stated accurately and usefully; otherwise swap for another state with clear statewide rules.
- **Latin honors with sub-schools:** data model supports cutoffs per school/college inside a university. Overview table shows one row per university with "varies by school" where needed; the college page lists every sub-school.
- **Percentile-based honors:** "do I qualify?" compares against the latest published cutoff, labelled with its year and a caveat that next year's may differ.
- **Freshness:** build prints a warning for any record whose last-checked date is older than 12 months. A short re-check runbook goes in `docs/`.

### Test prep decisions (settled before phase 4 is planned)
- All three score tools are **estimators**, labelled as such (digital SAT and PSAT are adaptive; ACT tables vary per form). Use our own approximate curves derived from published score ranges and percentiles — never copy an official conversion table verbatim and never reproduce test questions.
- PSAT page shows National Merit Selection Index math plus recent state cutoffs with year and source, labelled as past cutoffs.

## Technical choices (mirrors the owner's existing `calculate-finance` project)

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, lucide-react icons.
- MDX content files for the written sections of each tool.
- All pages statically generated (`generateStaticParams` for colleges/states). Host on Vercel.
- Light/dark theme.
- SEO: per-page metadata, canonical URLs, Open Graph images, JSON-LD (WebApplication/SoftwareApplication, FAQPage, BreadcrumbList), sitemap, breadcrumbs.
- Calculation logic in pure functions under `lib/` with Vitest unit tests (math must be correct — e.g. sig-fig edge cases, percent error with true value 0, molar mass parsing of parentheses/hydrates).
- Vercel Analytics (privacy-friendly, no cookies).

## Ads

- Reusable `<AdSlot>` component placed: below the calculator result, mid-content, and end of page. Never above the calculator or between inputs and result.
- Before approval: slots render nothing (no empty boxes). AdSense publisher ID set by environment variable; when present, slots render ads. `ads.txt` generated from the same variable.
- Cookie consent banner is needed for EU/UK visitors once AdSense is live — use Google's certified CMP via AdSense (no custom banner needed in v1).

## Left to the builder

- Visual design (clean, trustworthy, student-friendly; brand color of builder's choice), component structure, file layout.
- Exact wording of content (must be original, accurate, plain English at ~grade 8–10 reading level).
- Whether to include search on the site (nice to have).

## Owner identity (owner's decision)

Same as the owner's `calculate-finance` site: operator/author **Arslan Sarwar** (byline links to `/about`), contact email **arslansarwarwebdev@gmail.com**. Contact page uses a form that opens the visitor's mail app (`mailto:`) — no server, no stored data. About page states who runs the site and how formulas/data are checked, without claiming credentials the author doesn't hold.

## Scope and launch (owner's decision)

**All four hubs are built in this round**, in this order, each finished and tested before the next:

1. Scaffold + layout + site pages + GPA & Graduation hub (with data)
2. Chemistry hub
3. Statistics hub
4. Test prep hub (PSAT page live before October each year)

Apply to AdSense only after all four hubs are live.
