import { HUB_EXTRA_LINKS, HUBS } from '@/config/hubs'
import { FOOTER_LEGAL_LINKS, SITE } from '@/config/site'
import { toolPath, toolsInHub } from '@/config/tools'
import { BLOG } from '@/config/blog'
import { getPosts } from '@/lib/blog/posts'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'

// Rendered once at build time. Derived from the same registries as the sitemap
// so a new tool, college or state shows up here without a separate edit.
export const dynamic = 'force-static'

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description} ${SITE.disclaimerShort}`,
    '',
    ...HUBS.flatMap((hub) => [
      `## ${hub.name}`,
      ...toolsInHub(hub.slug).map((t) => `- [${t.name}](${SITE.url}${toolPath(t)}): ${t.summary}`),
      ...HUB_EXTRA_LINKS[hub.slug].map((l) => `- [${l.label}](${SITE.url}${l.href}): ${l.summary}`),
      '',
    ]),
    `## ${BLOG.name}`,
    ...getPosts().map((p) => `- [${p.title}](${SITE.url}${p.href}): ${p.description}`),
    '',
    '## Colleges',
    ...getColleges().map((c) => `- [${c.name} GPA scale and Latin honors](${SITE.url}/gpa/college/${c.slug})`),
    '',
    '## States',
    ...getStates().map((s) => `- [${s.name} high school graduation credits](${SITE.url}/high-school-credits/${s.slug})`),
    '',
    '## Optional',
    ...FOOTER_LEGAL_LINKS.map((l) => `- [${l.label}](${SITE.url}${l.href})`),
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
