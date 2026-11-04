import { notFound } from 'next/navigation'

import { getHub, HUB_EXTRA_LINKS, type HubSlug } from '@/config/hubs'
import { toolPath, toolsInHub } from '@/config/tools'
import { breadcrumbSchema } from '@/lib/seo/schema'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { RelatedTools } from '@/components/tools/related-tools'

/** Hub index: every tool in the hub, then the hub's data pages (colleges, states). */
export function HubPage({ slug, children }: { slug: HubSlug; children?: React.ReactNode }) {
  const hub = getHub(slug)
  if (!hub) notFound()
  const tools = toolsInHub(slug).map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary }))
  const breadcrumbItems = [{ label: hub.name, href: hub.href }]

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{hub.name}</h1>
        <p className="mt-2 text-lg text-ink-muted">{hub.summary}</p>
      </header>
      <div className="max-w-4xl space-y-10">
        <RelatedTools title="Tools" links={tools} />
        <RelatedTools title="Guides and lookups" links={HUB_EXTRA_LINKS[slug]} />
        {children}
      </div>
    </div>
  )
}
