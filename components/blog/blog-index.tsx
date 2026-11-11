import Link from 'next/link'
import { Rss } from 'lucide-react'

import { BLOG, BLOG_CATEGORIES } from '@/config/blog'
import type { Post } from '@/lib/blog/posts'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/seo/schema'
import { PostCard } from '@/components/blog/post-card'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { cn } from '@/lib/utils'

/** The blog index and each category page: same layout, different post list. */
export function BlogIndex({
  title,
  summary,
  path,
  posts,
  activeCategory,
  breadcrumbs,
}: {
  title: string
  summary: string
  path: string
  posts: Post[]
  activeCategory?: string
  breadcrumbs: { label: string; href: string }[]
}) {
  // The main index leads with the newest guide; category pages are a plain grid.
  const lead = activeCategory ? undefined : posts[0]
  const rest = lead ? posts.slice(1) : posts
  const chip = (active: boolean) =>
    cn(
      'inline-block rounded-full border px-3 py-1 text-sm transition-colors',
      active ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-ink hover:border-accent',
    )

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={collectionPageSchema({
          name: title,
          description: summary,
          url: path,
          items: posts.map((p) => ({ label: p.title, href: p.href })),
        })}
      />
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-lg text-ink-muted">{summary}</p>
        <a
          href={`${BLOG.href}/rss.xml`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
        >
          <Rss className="size-4" aria-hidden />
          RSS feed
        </a>
      </header>

      <nav aria-label="Guide categories" className="mb-10">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href={BLOG.href} className={chip(!activeCategory)} aria-current={!activeCategory ? 'page' : undefined}>
              All guides
            </Link>
          </li>
          {BLOG_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`${BLOG.href}/category/${c.slug}`}
                className={chip(activeCategory === c.slug)}
                aria-current={activeCategory === c.slug ? 'page' : undefined}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {posts.length === 0 && <p className="text-ink-muted">No guides in this category yet — check back soon.</p>}

      {lead && (
        <Link
          href={lead.href}
          className="group mb-8 block rounded-card border border-line bg-[radial-gradient(ellipse_at_top_left,var(--accent-soft),transparent_70%)] p-6 transition-colors hover:border-accent sm:p-8"
        >
          <span className="text-xs font-semibold tracking-wide text-accent uppercase">Latest guide</span>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-ink group-hover:text-accent sm:text-3xl">
            {lead.title}
          </h2>
          <p className="mt-2 max-w-3xl text-ink-muted">{lead.description}</p>
          <p className="mt-4 text-sm text-ink-subtle">{lead.readingMinutes} min read</p>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
