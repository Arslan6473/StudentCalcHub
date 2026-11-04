import { describe, expect, it } from 'vitest'

import sitemap from '@/app/sitemap'
import { FEATURED } from '@/config/featured'
import { HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { TOOLS, toolPath } from '@/config/tools'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'

const entries = sitemap()
const urls = entries.map((e) => e.url)
const has = (path: string) => expect(urls).toContain(`${SITE.url}${path}`)

describe('sitemap', () => {
  it('includes the homepage and every hub index', () => {
    has('/')
    for (const hub of HUBS) has(hub.href)
  })

  it('includes every registry tool', () => {
    for (const tool of TOOLS) has(toolPath(tool))
  })

  it('includes every data page and its index', () => {
    has('/gpa/latin-honors')
    has('/high-school-credits')
    for (const c of getColleges()) has(`/gpa/college/${c.slug}`)
    for (const s of getStates()) has(`/high-school-credits/${s.slug}`)
  })

  it('includes the six site pages', () => {
    for (const p of ['/about', '/contact', '/privacy', '/terms', '/disclaimer', '/editorial-policy']) has(p)
  })

  it('has no duplicate URLs', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('uses absolute URLs on the site origin', () => {
    for (const url of urls) expect(url.startsWith(SITE.url)).toBe(true)
  })

  it('dates data pages from their lastChecked', () => {
    const college = getColleges()[0]
    const entry = entries.find((e) => e.url === `${SITE.url}/gpa/college/${college.slug}`)
    expect(entry?.lastModified).toEqual(new Date(college.lastChecked))
  })
})

describe('FEATURED', () => {
  it('leads the homepage with the GPA tools in spec order', () => {
    expect(FEATURED).toEqual(['/gpa/grade-converter', '/gpa/latin-honors', '/high-school-credits'])
  })
})
