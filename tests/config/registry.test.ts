import { describe, expect, it } from 'vitest'
import { TOOLS, getTool, toolPath } from '@/config/tools'
import { TOOL_COMPONENT_SLUGS } from '@/components/tools/instance-slugs'

describe('tool registry', () => {
  it('has at least one tool', () => {
    expect(TOOLS.length).toBeGreaterThan(0)
  })

  it('has unique slugs within each hub', () => {
    const keys = TOOLS.map((t) => toolPath(t))
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('resolves every related link to a tool slug or a site path', () => {
    const slugs = new Set(TOOLS.map((t) => t.slug))
    for (const tool of TOOLS) {
      for (const rel of tool.related) {
        expect(rel.startsWith('/') || slugs.has(rel), `${tool.slug} → ${rel}`).toBe(true)
      }
    }
  })

  it('gives every tool at least 4 FAQs that are real questions', () => {
    for (const tool of TOOLS) {
      expect(tool.faqs.length, tool.slug).toBeGreaterThanOrEqual(4)
      for (const faq of tool.faqs) {
        expect(faq.question.trim().endsWith('?'), faq.question).toBe(true)
        expect(faq.answer.length, faq.question).toBeGreaterThan(40)
      }
    }
  })

  it('gives every tool at least one source', () => {
    for (const tool of TOOLS) expect(tool.sources.length, tool.slug).toBeGreaterThanOrEqual(1)
  })

  it('maps every tool to a calculator component', () => {
    for (const tool of TOOLS) expect(TOOL_COMPONENT_SLUGS, tool.slug).toContain(tool.slug)
  })

  it('keeps SEO titles and descriptions within search-result limits', () => {
    for (const tool of TOOLS) {
      expect(tool.seo.title.length, tool.seo.title).toBeLessThanOrEqual(60)
      expect(tool.seo.description.length, tool.slug).toBeLessThanOrEqual(160)
    }
  })

  it('finds tools by hub and slug', () => {
    const first = TOOLS[0]
    expect(getTool(first.hub, first.slug)).toBe(first)
    expect(getTool(first.hub, 'does-not-exist')).toBeUndefined()
  })
})
