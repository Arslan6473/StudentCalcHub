# SEO audit — November 2026

Manual audit of the built site (`npm run build`, then reading the prerendered HTML in `.next/server/app`). No SEO
tooling or skill was used; every check below was done against the source and build output.

## What was already good

- Canonical URL on every page (`alternates.canonical`), `metadataBase` set from `SITE.url`.
- `sitemap.xml`, `robots.txt` and `llms.txt` generated from the tool registry, so new tools are never missed.
- JSON-LD on tool pages: `WebApplication`, `BreadcrumbList`, `FAQPage` (from MDX FAQs), `Organization`, `WebSite`.
- Every tool and data page cites official sources and shows a "last checked" date, a strong E-E-A-T signal.
- All pages are statically prerendered; no client-side-only content.

## Problems found and fixed on this branch

| Issue | Fix |
| --- | --- |
| Homepage H1 was just the brand name | Keyword H1 "Student calculators that show every step" plus a descriptive default title |
| Copy and schema targeted the US only (`inLanguage: en-US`, "GPA & Graduation") | Global copy, `inLanguage: en`, Open Graph locale `en`, "GPA & Grades" hub with international tools; US data pages labelled "US" |
| Hub pages had no Open Graph title/URL | `hubMetadata()` in `lib/tool-route.ts` |
| Hub pages had no collection schema | `CollectionPage` + `ItemList` JSON-LD (`collectionPageSchema`) |
| Duplicate `id="related-heading"` on hub pages | `RelatedTools` takes an `id` prop |
| Tool pages shared the generic site social image | Per-tool `opengraph-image.tsx` in each hub's `[tool]` route |
| No content beyond tools — nothing to rank for informational queries | `/blog` with categories, `Article` JSON-LD, TOC with anchor ids, RSS feed, sitemap entries, cross-links from tools and hubs |
| Thin internal linking | Tool pages link to related guides, guides link to their calculators, footer links every hub and guide category |
| No field performance data | `@vercel/speed-insights` added next to the existing `@vercel/analytics` |

## Recommendations (not done — need accounts or ongoing work)

1. **Search Console + Bing Webmaster Tools.** Verify the domain and submit `/sitemap.xml` and `/blog/rss.xml`.
2. **Publish steadily.** One or two guides a month per category, each linking to a calculator. Target question
   queries ("how to convert CGPA to percentage", "what is a 2:1 degree") that the tools answer.
3. **Country-specific landing pages** where the data is official, e.g. CGPA presets per university, following the
   same cite-the-source rule as the US college pages.
4. **Watch Core Web Vitals** in Speed Insights after launch; the ad slots are the most likely CLS risk.
5. **Backlinks.** University study-abroad offices and teacher resource pages are the natural targets for the
   grade-conversion tools.
6. **hreflang** only if translated pages are ever added; English-only today, so none is needed.
