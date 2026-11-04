import type { Metadata } from 'next'

import type { HubSlug } from '@/config/hubs'
import { getTool, toolPath, toolsInHub } from '@/config/tools'

/** Shared by every app/<hub>/[tool]/page.tsx so the four routes cannot drift. */
export function toolStaticParams(hub: HubSlug): { tool: string }[] {
  return toolsInHub(hub).map((t) => ({ tool: t.slug }))
}

export function toolMetadata(hub: HubSlug, slug: string): Metadata {
  const tool = getTool(hub, slug)
  if (!tool) return {}
  const path = toolPath(tool)
  return {
    title: { absolute: tool.seo.title },
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: { canonical: path },
    openGraph: { title: tool.seo.title, description: tool.seo.description, url: path, type: 'website' },
  }
}
