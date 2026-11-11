import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { BLOG, BLOG_CATEGORIES, getBlogCategory } from '@/config/blog'
import { postsInCategory } from '@/lib/blog/posts'
import { BlogIndex } from '@/components/blog/blog-index'

export const dynamicParams = false

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/blog/category/[category]'>): Promise<Metadata> {
  const category = getBlogCategory((await params).category)
  if (!category) return {}
  const path = `${BLOG.href}/category/${category.slug}`
  const title = `${category.name} Guides for Students`
  const empty = postsInCategory(category.slug).length === 0
  return {
    title,
    description: category.summary,
    alternates: { canonical: path },
    openGraph: { title, description: category.summary, url: path, type: 'website' },
    // An empty category is a thin page; keep it out of the index until it has guides.
    ...(empty ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function Page({ params }: PageProps<'/blog/category/[category]'>) {
  const category = getBlogCategory((await params).category)
  if (!category) notFound()
  const path = `${BLOG.href}/category/${category.slug}`
  return (
    <BlogIndex
      title={`${category.name} guides`}
      summary={category.summary}
      path={path}
      posts={postsInCategory(category.slug)}
      activeCategory={category.slug}
      breadcrumbs={[
        { label: BLOG.name, href: BLOG.href },
        { label: category.name, href: path },
      ]}
    />
  )
}
