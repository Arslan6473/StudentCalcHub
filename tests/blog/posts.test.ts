import { describe, expect, it } from 'vitest'

import sitemap from '@/app/sitemap'
import { HUB_EXTRA_LINKS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { TOOLS, toolPath } from '@/config/tools'
import { extractHeadings, getPosts, readingMinutes, relatedPosts } from '@/lib/blog/posts'

const posts = getPosts()
const knownPaths = new Set([...TOOLS.map(toolPath), ...Object.values(HUB_EXTRA_LINKS).flat().map((l) => l.href)])

describe('blog posts', () => {
  it('load with valid frontmatter, newest first', () => {
    const dates = posts.map((p) => p.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  for (const post of posts) {
    it(`${post.slug} links only to pages that exist`, () => {
      for (const href of post.relatedTools) expect(knownPaths, href).toContain(href)
      for (const [, href] of post.body.matchAll(/\]\((\/[^)#\s]*)/g)) {
        expect(knownPaths.has(href) || href === '/blog' || href.startsWith('/blog/') || href.startsWith('/gpa/college/') || href.startsWith('/high-school-credits/'), href).toBe(true)
      }
    })

    it(`${post.slug} has no H1 in the body (the title is the H1)`, () => {
      expect(post.body).not.toMatch(/^# /m)
    })

    it(`${post.slug} is in the sitemap`, () => {
      expect(sitemap().map((e) => e.url)).toContain(`${SITE.url}${post.href}`)
    })
  }

  it('relatedPosts never returns the post itself', () => {
    for (const post of posts) expect(relatedPosts(post).map((p) => p.slug)).not.toContain(post.slug)
  })
})

describe('extractHeadings', () => {
  it('matches rehype-slug ids, skips code blocks and strips link syntax', () => {
    const body = '## How it works\n\n```\n## not a heading\n```\n\n### Step 1: [the formula](/x)\n\n## How it works'
    expect(extractHeadings(body)).toEqual([
      { depth: 2, text: 'How it works', id: 'how-it-works' },
      { depth: 3, text: 'Step 1: the formula', id: 'step-1-the-formula' },
      { depth: 2, text: 'How it works', id: 'how-it-works-1' },
    ])
  })
})

describe('readingMinutes', () => {
  it('is at least 1 and rounds at 220 words a minute', () => {
    expect(readingMinutes('word')).toBe(1)
    expect(readingMinutes(Array(660).fill('w').join(' '))).toBe(3)
  })
})
