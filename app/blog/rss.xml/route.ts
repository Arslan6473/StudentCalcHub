import { BLOG, getBlogCategory } from '@/config/blog'
import { SITE } from '@/config/site'
import { getPosts } from '@/lib/blog/posts'

export const dynamic = 'force-static'

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function GET() {
  const posts = getPosts()
  const items = posts.map(
    (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE.url}${p.href}</link>
      <guid isPermaLink="true">${SITE.url}${p.href}</guid>
      <description>${escape(p.description)}</description>
      <category>${escape(getBlogCategory(p.category)?.name ?? p.category)}</category>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`,
  )
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${SITE.name} ${BLOG.name}`)}</title>
    <link>${SITE.url}${BLOG.href}</link>
    <description>${escape(BLOG.summary)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}${BLOG.href}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
