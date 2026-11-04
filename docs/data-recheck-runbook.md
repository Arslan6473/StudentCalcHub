# Data re-check runbook

Every college, state and cutoff record in `data/` carries its official `sources` and a
`lastChecked` date (YYYY-MM-DD). `npm run build` runs `scripts/check-freshness.mjs` first and
prints `⚠ stale data: <file>` for anything not re-checked in 12 months. It only warns — the
build still succeeds — so treat the warnings as a to-do list.

## Re-check one record

1. Open the JSON file (`data/colleges/<slug>.json` or `data/states/<slug>.json`).
2. Open each URL in `sources`. Only official pages count: the college registrar / catalog, or
   the state department of education (or state statute/administrative code).
3. Compare every value on the page against the file:
   - Colleges: the grade-point scale, `scaleNotes`, `nonGpaGrades`, every school's Latin honors
     cutoffs and extra requirements, `honors.rule`, `deansList`.
   - States: `appliesToClassOf`, each plan's `totalCredits` and subject credits, `otherRequirements`.
4. Update anything that changed. If a source moved, replace the URL. If a value can no longer
   be confirmed from an official source, **remove the record** rather than keep a guess.
5. Set `lastChecked` to today's date, even if nothing changed.
6. Run `npm test` (schemas validate every file) and `npm run build`.

## Yearly calendar

| When | What | Why |
|---|---|---|
| August | Colleges with `honors.basis: "percentile"` (e.g. UCLA) | New cutoff tables are published for the coming academic year; update `academicYear` too. |
| September | All state graduation requirements | Legislatures and boards change rules over the summer; check whether a new graduating class is affected. |
| September | `data/nmsqt-cutoffs.json` (PSAT National Merit) | Commended and state Semifinalist cutoffs for the previous October's PSAT are released in September. |
| Any time | Any record the build flags as stale | Over 12 months since last checked. |

## Adding a new college or state

Copy a similar existing file, fill every field from official sources only, and run `npm test`.
The page, the overview table, the sitemap and internal links pick it up automatically.
