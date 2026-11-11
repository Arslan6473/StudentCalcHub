import { notFound } from 'next/navigation'

import { HUB_BLOG_CATEGORIES } from '@/config/blog'
import { getHub, HUB_EXTRA_LINKS, type HubSlug } from '@/config/hubs'
import { toolPath, toolsInHub } from '@/config/tools'
import { getPosts } from '@/lib/blog/posts'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/seo/schema'
import { PostGrid } from '@/components/blog/post-card'
import { HubIcon } from '@/components/navigation/hub-icon'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { RelatedTools } from '@/components/tools/related-tools'

/** Hub index: every tool in the hub, then the hub's data pages (colleges, states), then its guides. */
export function HubPage({ slug, children }: { slug: HubSlug; children?: React.ReactNode }) {
  const hub = getHub(slug)
  if (!hub) notFound()
  const tools = toolsInHub(slug).map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary }))
  const breadcrumbItems = [{ label: hub.name, href: hub.href }]
  const categories: string[] = HUB_BLOG_CATEGORIES[slug]
  const guides = getPosts()
    .filter((p) => categories.includes(p.category))
    .slice(0, 6)

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        data={collectionPageSchema({
          name: hub.name,
          description: hub.summary,
          url: hub.href,
          items: [...tools, ...HUB_EXTRA_LINKS[slug]],
        })}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header className="mb-10 flex max-w-3xl items-start gap-4">
        <HubIcon slug={slug} className="size-12" />
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">{hub.name}</h1>
          <p className="mt-2 text-lg text-ink-muted">{hub.summary}</p>
        </div>
      </header>
      <div className="max-w-5xl space-y-12">
        <RelatedTools title="Tools" id="hub-tools" links={tools} />
        <RelatedTools title="Data and lookups" id="hub-data" links={HUB_EXTRA_LINKS[slug]} />
        {children}
        <PostGrid posts={guides} title="Guides" id="hub-guides" />
      </div>
    </div>
  )
}
