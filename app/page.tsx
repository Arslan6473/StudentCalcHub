import Link from 'next/link'
import { BookOpen, Globe, ListOrdered, ShieldCheck } from 'lucide-react'

import { BLOG } from '@/config/blog'
import { FEATURED, INTERNATIONAL } from '@/config/featured'
import { HUB_EXTRA_LINKS, HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { TOOLS, toolPath, toolsInHub } from '@/config/tools'
import { getPosts } from '@/lib/blog/posts'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'
import { searchIndex } from '@/lib/search'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import { PostGrid } from '@/components/blog/post-card'
import { LinkCard } from '@/components/content/link-card'
import { HubIcon } from '@/components/navigation/hub-icon'
import { SiteSearch } from '@/components/search/site-search'
import { JsonLd } from '@/components/seo/json-ld'
import { LearningNote } from '@/components/tools/learning-note'

/** Every linkable page the homepage can feature, keyed by path: registry tools plus hub data pages. */
const LINKS_BY_HREF = new Map(
  [
    ...TOOLS.map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary })),
    ...Object.values(HUB_EXTRA_LINKS).flat(),
  ].map((link) => [link.href, link]),
)

const chipClass =
  'inline-block rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink transition-colors hover:border-accent hover:text-accent'

const PROMISES = [
  { icon: ListOrdered, title: 'Every step shown', text: 'See the formula and the working, not just a number.' },
  { icon: ShieldCheck, title: 'Official sources', text: 'Data and formulas cite the body that publishes them.' },
  { icon: Globe, title: 'For students everywhere', text: 'Free, no sign-up, and it all runs in your browser.' },
]

export default function HomePage() {
  // Featured hrefs can name tools that aren't registered yet; skip them rather than render a dead card.
  const pick = (hrefs: readonly string[]) => hrefs.flatMap((href) => LINKS_BY_HREF.get(href) ?? [])
  const posts = getPosts().slice(0, 3)

  return (
    <div>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_70%)]">
        <div className="container-page py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-muted">
              <Globe className="size-4 text-accent" aria-hidden />
              Free study calculators for students worldwide
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl">
              Student calculators that <span className="text-accent">show every step</span>
            </h1>
            <p className="mt-4 text-lg text-pretty text-ink-muted">{SITE.description}</p>
            <div className="mx-auto mt-8 max-w-xl">
              <SiteSearch entries={searchIndex()} variant="hero" />
            </div>
            <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tool hubs">
              {HUBS.map((hub) => (
                <li key={hub.slug}>
                  <Link href={hub.href} className={chipClass}>
                    {hub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        <ul className="grid gap-4 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block font-medium text-ink">{title}</span>
                <span className="text-sm text-ink-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
        <LearningNote />

        <HomeSection id="international" title="Convert grades between countries" href="/gpa">
          <p className="-mt-2 mb-4 max-w-3xl text-ink-muted">
            Applying abroad or comparing results? Turn a CGPA into a percentage, a percentage into a 4.0 GPA, or module marks
            into a UK degree class — with the formula shown.
          </p>
          <CardGrid links={pick(INTERNATIONAL)} />
        </HomeSection>

        {HUBS.map((hub) => (
          <HomeSection key={hub.slug} id={`hub-${hub.slug}`} title={hub.name} href={hub.href} icon={<HubIcon slug={hub.slug} />}>
            <p className="-mt-2 mb-4 max-w-3xl text-ink-muted">{hub.summary}</p>
            <CardGrid
              links={
                hub.slug === 'gpa'
                  ? pick(FEATURED)
                  : toolsInHub(hub.slug).map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary }))
              }
            />
          </HomeSection>
        ))}

        <section aria-labelledby="us-data" className="mt-14 rounded-card border border-line bg-surface p-6">
          <h2 id="us-data" className="text-xl font-semibold text-ink">
            US college and high school data
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Checked against each school’s or state’s official published rules.</p>
          <h3 className="mt-5 text-sm font-semibold text-ink">GPA scales and Latin honors by college</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {getColleges().map((c) => (
              <li key={c.slug}>
                <Link href={`/gpa/college/${c.slug}`} className={chipClass}>
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-ink">High school graduation credits by state</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {getStates().map((s) => (
              <li key={s.slug}>
                <Link href={`/high-school-credits/${s.slug}`} className={chipClass}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <div className="mt-14">
            <PostGrid posts={posts} title="Latest study guides" id="latest-guides" />
            <Link
              href={BLOG.href}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              <BookOpen className="size-4" aria-hidden />
              Browse all guides
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function HomeSection({
  id,
  title,
  href,
  icon,
  children,
}: {
  id: string
  title: string
  href: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h2 id={id} className="text-2xl font-semibold text-ink">
          <Link href={href} className="hover:text-accent">
            {title}
          </Link>
        </h2>
      </div>
      {children}
    </section>
  )
}

function CardGrid({ links }: { links: { label: string; href: string; summary?: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <li key={link.href}>
          <LinkCard href={link.href} label={link.label} summary={link.summary} />
        </li>
      ))}
    </ul>
  )
}
