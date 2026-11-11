import { Clock } from 'lucide-react'

import { getBlogCategory } from '@/config/blog'
import type { Post } from '@/lib/blog/posts'
import { formatDate } from '@/lib/format-date'
import { LinkCard } from '@/components/content/link-card'

export function PostCard({ post }: { post: Post }) {
  return (
    <LinkCard
      href={post.href}
      label={post.title}
      summary={post.description}
      eyebrow={getBlogCategory(post.category)?.name}
      meta={
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {post.readingMinutes} min read · <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
      }
    />
  )
}

/** A titled grid of posts; renders nothing when there are none. */
export function PostGrid({ posts, title, id }: { posts: Post[]; title: string; id: string }) {
  if (posts.length === 0) return null
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-4 text-2xl font-semibold text-ink">
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}
