import Link from 'next/link'

import { FEATURED } from '@/config/featured'
import { HUB_EXTRA_LINKS, HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { TOOLS, toolPath, toolsInHub } from '@/config/tools'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/json-ld'
import { LearningNote } from '@/components/tools/learning-note'

/** Every linkable page the homepage can feature, keyed by path: registry tools plus hub data pages. */
const LINKS_BY_HREF = new Map(
  [
    ...TOOLS.map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary })),
    ...Object.values(HUB_EXTRA_LINKS).flat(),
  ].map((link) => [link.href, link]),
)

const cardClass =
  'block h-full rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent'
const chipClass =
  'inline-block rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink transition-colors hover:border-accent'

export default function HomePage() {
  const featured = FEATURED.map((href) => LINKS_BY_HREF.get(href)!)
  const gpa = HUBS[0]

  return (
    <div className="container-page py-8">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{SITE.name}</h1>
        <p className="mt-2 text-lg text-ink-muted">{SITE.description}</p>
        <LearningNote />
      </header>

      <section aria-labelledby="hub-gpa" className="mt-10">
        <h2 id="hub-gpa" className="text-2xl font-semibold text-ink">
          <Link href={gpa.href} className="hover:text-accent">
            {gpa.name}
          </Link>
        </h2>
        <p className="mt-1 max-w-3xl text-ink-muted">{gpa.summary}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {featured.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={cardClass}>
                <span className="font-medium text-ink">{link.label}</span>
                <span className="mt-1 block text-sm text-ink-muted">{link.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="popular-colleges" className="mt-8">
        <h3 id="popular-colleges" className="text-lg font-semibold text-ink">
          GPA scales and Latin honors by college
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {getColleges().map((c) => (
            <li key={c.slug}>
              <Link href={`/gpa/college/${c.slug}`} className={chipClass}>
                {c.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="popular-states" className="mt-6">
        <h3 id="popular-states" className="text-lg font-semibold text-ink">
          High school graduation credits by state
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {getStates().map((s) => (
            <li key={s.slug}>
              <Link href={`/high-school-credits/${s.slug}`} className={chipClass}>
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {HUBS.slice(1).map((hub) => (
        <section key={hub.slug} aria-labelledby={`hub-${hub.slug}`} className="mt-10">
          <h2 id={`hub-${hub.slug}`} className="text-2xl font-semibold text-ink">
            <Link href={hub.href} className="hover:text-accent">
              {hub.name}
            </Link>
          </h2>
          <p className="mt-1 max-w-3xl text-ink-muted">{hub.summary}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolsInHub(hub.slug).map((tool) => (
              <li key={tool.slug}>
                <Link href={toolPath(tool)} className={cardClass}>
                  <span className="font-medium text-ink">{tool.name}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{tool.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
