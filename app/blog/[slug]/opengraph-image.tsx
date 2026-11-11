import { getBlogCategory } from '@/config/blog'
import { getPost, getPosts } from '@/lib/blog/posts'
import { OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const alt = 'Study guide'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  return renderOgImage({
    eyebrow: post ? `${getBlogCategory(post.category)?.name ?? 'Study'} guide` : 'Study guide',
    title: post?.title ?? 'Study guide',
  })
}
