import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Clock } from 'lucide-react'

import { BLOG, getBlogCategory } from '@/config/blog'
import { HUB_EXTRA_LINKS } from '@/config/hubs'
import { TOOLS, toolPath } from '@/config/tools'
import { getPost, getPosts, relatedPosts } from '@/lib/blog/posts'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema'
import { PostGrid } from '@/components/blog/post-card'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { EditorialByline } from '@/components/content/editorial-byline'
import { Mdx } from '@/components/content/mdx'
import { AdSlot } from '@/components/ads/ad-slot'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { RelatedTools } from '@/components/tools/related-tools'

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return {
    // Long titles skip the "| StudentCalcHub" suffix so the search snippet isn't cut mid-phrase.
    title: post.title.length > 44 ? { absolute: post.title } : post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: post.href },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.href,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      section: getBlogCategory(post.category)?.name,
      tags: post.tags,
    },
  }
}

/** Related paths as cards: registry tools and hub data pages get their name and summary. */
function toolLinks(paths: string[]): { label: string; href: string; summary?: string }[] {
  const known = [
    ...TOOLS.map((t) => ({ label: t.name, href: toolPath(t), summary: t.summary })),
    ...Object.values(HUB_EXTRA_LINKS).flat(),
  ]
  // Unknown paths are dropped rather than shown as a bare URL.
  return paths.flatMap((href) => known.find((l) => l.href === href) ?? [])
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const category = getBlogCategory(post.category)!
  const categoryPath = `${BLOG.href}/category/${category.slug}`
  const breadcrumbItems = [
    { label: BLOG.name, href: BLOG.href },
    { label: category.name, href: categoryPath },
    { label: post.title, href: post.href },
  ]
  const tools = toolLinks(post.relatedTools)

  return (
    <div className="container-page py-8">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          url: post.href,
          datePublished: post.date,
          dateModified: post.updated,
          section: category.name,
          keywords: post.tags,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="max-w-3xl min-w-0">
          <header className="mb-8">
            <Link href={categoryPath} className="text-xs font-semibold tracking-wide text-accent uppercase hover:underline">
              {category.name}
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-lg text-ink-muted">{post.description}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-subtle">
              <Clock className="size-4" aria-hidden />
              {post.readingMinutes} min read
            </p>
            <EditorialByline updated={post.updated} />
          </header>

          <TableOfContents headings={post.headings} className="mb-8 lg:hidden" />

          <Mdx source={post.body} />
          <AdSlot placement="end-of-page" />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents headings={post.headings} />
            {tools.length > 0 && (
              <div className="rounded-card border border-line bg-surface p-4">
                <p className="mb-2 text-sm font-semibold text-ink">Try the calculator</p>
                <ul className="space-y-1.5 text-sm">
                  {tools.map((t) => (
                    <li key={t.href}>
                      <Link href={t.href} className="text-accent hover:underline">
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-12 max-w-5xl space-y-12">
        <RelatedTools title="Calculators for this guide" id="post-tools" links={tools} />
        <PostGrid posts={relatedPosts(post)} title="Keep reading" id="post-related" />
      </div>
    </div>
  )
}
