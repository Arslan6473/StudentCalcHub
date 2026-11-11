import { BLOG, getBlogCategory } from '@/config/blog'
import { HUB_EXTRA_LINKS, HUBS } from '@/config/hubs'
import { TOOLS, toolPath } from '@/config/tools'
import { getPosts } from '@/lib/blog/posts'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'

export interface SearchEntry {
  label: string
  href: string
  /** Group heading in the results list. */
  group: 'Tools' | 'Guides' | 'Data pages' | 'Hubs'
  /** Extra words that should match but aren't shown, e.g. keywords. */
  terms: string
}

/** Everything the site search can find. Built at render time from the same registries as the sitemap. */
export function searchIndex(): SearchEntry[] {
  const hubName = (slug: string) => HUBS.find((h) => h.slug === slug)?.name ?? ''
  return [
    ...TOOLS.map((t) => ({
      label: t.name,
      href: toolPath(t),
      group: 'Tools' as const,
      terms: [t.shortName, hubName(t.hub), ...t.seo.keywords].join(' '),
    })),
    ...getPosts().map((p) => ({
      label: p.title,
      href: p.href,
      group: 'Guides' as const,
      terms: [getBlogCategory(p.category)?.name, ...p.tags].join(' '),
    })),
    ...Object.values(HUB_EXTRA_LINKS)
      .flat()
      .map((l) => ({ label: l.label, href: l.href, group: 'Data pages' as const, terms: l.summary })),
    ...getColleges().map((c) => ({
      label: `${c.name} GPA scale & Latin honors`,
      href: `/gpa/college/${c.slug}`,
      group: 'Data pages' as const,
      terms: `${c.shortName} college university gpa honors`,
    })),
    ...getStates().map((s) => ({
      label: `${s.name} high school graduation credits`,
      href: `/high-school-credits/${s.slug}`,
      group: 'Data pages' as const,
      terms: 'state credits diploma graduate',
    })),
    ...HUBS.map((h) => ({ label: h.name, href: h.href, group: 'Hubs' as const, terms: h.summary })),
    { label: BLOG.name, href: BLOG.href, group: 'Hubs' as const, terms: 'blog articles guides' },
  ]
}
