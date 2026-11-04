import { notFound } from 'next/navigation'
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { getHub } from '@/config/hubs'
import { relatedLinks, toolPath } from '@/config/tools'
import type { ToolConfig } from '@/config/tools/types'
import { readToolContent } from '@/lib/content/read-content'
import { breadcrumbSchema, faqSchema, webApplicationSchema } from '@/lib/seo/schema'
import { mdxComponents } from '@/components/content/mdx-components'
import { EditorialByline } from '@/components/content/editorial-byline'
import { AdSlot } from '@/components/ads/ad-slot'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { TOOL_COMPONENTS_BY_SLUG } from '@/components/tools/instances'
import { FaqSection } from '@/components/tools/faq-section'
import { LearningNote } from '@/components/tools/learning-note'
import { RelatedTools } from '@/components/tools/related-tools'
import { SourcesList } from '@/components/tools/sources-list'

/**
 * The one template every tool page renders through. Ads sit after the result,
 * mid-content and at the end — never above the calculator or between its
 * inputs and result.
 */
export async function ToolPage({ tool }: { tool: ToolConfig }) {
  const hub = getHub(tool.hub)
  const Calculator = TOOL_COMPONENTS_BY_SLUG[tool.slug]
  if (!hub || !Calculator) notFound()
  const [firstSection, rest] = splitAfterFirstSection(await readToolContent(tool.slug))
  const path = toolPath(tool)

  const breadcrumbItems = [
    { label: hub.name, href: hub.href },
    { label: tool.name, href: path },
  ]

  return (
    <div className="container-page py-8">
      <JsonLd
        data={webApplicationSchema({ name: tool.name, description: tool.seo.description, url: path, dateModified: tool.updated })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={faqSchema(tool.faqs)} />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{tool.name}</h1>
        <p className="mt-2 text-lg text-ink-muted">{tool.summary}</p>
        <EditorialByline updated={tool.updated} />
      </header>

      <Calculator />
      <LearningNote />
      <AdSlot placement="after-result" />

      <article className="mt-12 max-w-3xl">
        <Mdx source={firstSection} />
        <AdSlot placement="in-content" />
        {rest && <Mdx source={rest} />}
      </article>

      <div className="mt-10 max-w-3xl space-y-10">
        <FaqSection faqs={tool.faqs} />
        <SourcesList sources={tool.sources} />
        <RelatedTools links={relatedLinks(tool)} />
        <AdSlot placement="end-of-page" />
      </div>
    </div>
  )
}

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
} satisfies MDXRemoteProps['options']

function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={mdxComponents} options={MDX_OPTIONS} />
}

/** Splits at the second `## ` heading so the in-content ad sits after the first section. */
function splitAfterFirstSection(source: string): [string, string] {
  const headings = [...source.matchAll(/^## /gm)]
  if (headings.length < 2) return [source, '']
  const at = headings[1].index
  return [source.slice(0, at), source.slice(at)]
}
