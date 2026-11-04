import type { MetadataRoute } from 'next'

import { HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { TOOLS, toolPath, toolsInHub } from '@/config/tools'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'

/** The newest of a set of ISO dates. */
function latest(dates: string[]): string {
  return dates.reduce((a, b) => (a > b ? a : b))
}

// `lastModified` is only set where it reflects a real content change: a tool's
// `updated` or a data record's `lastChecked`. Site pages have no tracked
// revision date, so they leave it out rather than stamp the build time.
export default function sitemap(): MetadataRoute.Sitemap {
  const colleges = getColleges()
  const states = getStates()
  const collegesChecked = latest(colleges.map((c) => c.lastChecked))
  const statesChecked = latest(states.map((s) => s.lastChecked))
  // A hub index lists its tools (and, for GPA, the college and state pages), so it changes when they do.
  const hubDates: Record<string, string> = Object.fromEntries(
    HUBS.map((hub) => {
      const dates = toolsInHub(hub.slug).map((t) => t.updated)
      if (hub.slug === 'gpa') dates.push(collegesChecked, statesChecked)
      return [hub.slug, latest(dates)]
    }),
  )

  const entry = (path: string, date: string | undefined, priority: number) => ({
    url: `${SITE.url}${path}`,
    ...(date ? { lastModified: new Date(date) } : {}),
    priority,
  })

  return [
    entry('/', latest(Object.values(hubDates)), 1),
    ...HUBS.map((hub) => entry(hub.href, hubDates[hub.slug], 0.9)),
    ...TOOLS.map((tool) => entry(toolPath(tool), tool.updated, 0.8)),
    entry('/gpa/latin-honors', collegesChecked, 0.8),
    ...colleges.map((c) => entry(`/gpa/college/${c.slug}`, c.lastChecked, 0.7)),
    entry('/high-school-credits', statesChecked, 0.8),
    ...states.map((s) => entry(`/high-school-credits/${s.slug}`, s.lastChecked, 0.7)),
    ...['/about', '/editorial-policy', '/disclaimer', '/privacy', '/terms', '/contact'].map((p) =>
      entry(p, undefined, 0.3),
    ),
  ]
}
