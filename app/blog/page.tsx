import type { Metadata } from 'next'

import { BLOG } from '@/config/blog'
import { getPosts } from '@/lib/blog/posts'
import { BlogIndex } from '@/components/blog/blog-index'

const TITLE = `${BLOG.name}: GPA, Grades, Chemistry & Statistics`

export const metadata: Metadata = {
  title: TITLE,
  description: BLOG.summary,
  alternates: { canonical: BLOG.href, types: { 'application/rss+xml': `${BLOG.href}/rss.xml` } },
  openGraph: { title: TITLE, description: BLOG.summary, url: BLOG.href, type: 'website' },
}

export default function Page() {
  return (
    <BlogIndex
      title={BLOG.name}
      summary={BLOG.summary}
      path={BLOG.href}
      posts={getPosts()}
      breadcrumbs={[{ label: BLOG.name, href: BLOG.href }]}
    />
  )
}
