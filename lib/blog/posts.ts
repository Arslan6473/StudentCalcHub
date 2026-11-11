import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import GithubSlugger from 'github-slugger'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'

import { BLOG_CATEGORIES, BLOG } from '@/config/blog'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const WORDS_PER_MINUTE = 220

const FrontmatterSchema = z.object({
  title: z.string().min(10).max(110),
  description: z.string().min(50).max(170),
  date: z.iso.date(),
  updated: z.iso.date(),
  category: z.enum(BLOG_CATEGORIES.map((c) => c.slug)),
  tags: z.array(z.string().min(1)).default([]),
  relatedTools: z.array(z.string().startsWith('/')).default([]),
})

export interface PostHeading {
  depth: 2 | 3
  text: string
  id: string
}

export interface Post extends z.infer<typeof FrontmatterSchema> {
  slug: string
  href: string
  /** MDX body without the frontmatter block. */
  body: string
  readingMinutes: number
  headings: PostHeading[]
}

/** Splits `---` YAML frontmatter from the MDX body. */
function splitFrontmatter(source: string): [string, string] {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return ['', source]
  return [match[1], source.slice(match[0].length)]
}

/** `##`/`###` headings, with ids generated the same way rehype-slug does so TOC links resolve. */
export function extractHeadings(body: string): PostHeading[] {
  const slugger = new GithubSlugger()
  const withoutCode = body.replace(/```[\s\S]*?```/g, '')
  return [...withoutCode.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)].map((m) => {
    // Link text, emphasis and inline code markers aren't part of the rendered heading text.
    const text = m[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '')
    return { depth: m[1].length as 2 | 3, text, id: slugger.slug(text) }
  })
}

export function readingMinutes(body: string): number {
  const words = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function loadPost(file: string): Post {
  const slug = file.replace(/\.mdx$/, '')
  const [frontmatter, body] = splitFrontmatter(readFileSync(path.join(BLOG_DIR, file), 'utf8'))
  const parsed = FrontmatterSchema.safeParse(parseYaml(frontmatter) ?? {})
  // Fail the build loudly rather than ship a post with missing metadata.
  if (!parsed.success) throw new Error(`Invalid frontmatter in content/blog/${file}: ${parsed.error.message}`)
  return {
    ...parsed.data,
    slug,
    href: `${BLOG.href}/${slug}`,
    body,
    readingMinutes: readingMinutes(body),
    headings: extractHeadings(body),
  }
}

/** Every post, newest first. */
export function getPosts(): Post[] {
  if (!existsSync(BLOG_DIR)) return []
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(loadPost)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug)
}

export function postsInCategory(category: string): Post[] {
  return getPosts().filter((p) => p.category === category)
}

/** Same category first, then shared tags, then newest. Never includes the post itself. */
export function relatedPosts(post: Post, limit = 3): Post[] {
  const score = (other: Post) =>
    (other.category === post.category ? 2 : 0) + other.tags.filter((t) => post.tags.includes(t)).length
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p)
}
