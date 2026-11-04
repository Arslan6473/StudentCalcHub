import { describe, expect, it } from 'vitest'

import { getColleges, getCollege } from '@/lib/data/colleges'

const colleges = getColleges()
const today = '2026-11-04'

describe('college data', () => {
  it('has at least 12 colleges', () => {
    expect(colleges.length).toBeGreaterThanOrEqual(12)
  })

  it('uses URL-safe unique slugs', () => {
    for (const c of colleges) expect(c.slug).toMatch(/^[a-z0-9-]+$/)
    expect(new Set(colleges.map((c) => c.slug)).size).toBe(colleges.length)
  })

  it('orders honors cutoffs cum < magna < summa wherever defined', () => {
    for (const c of colleges) {
      for (const s of c.honors.schools) {
        const levels = [s.cumLaude, s.magnaCumLaude, s.summaCumLaude].filter((n): n is number => n !== undefined)
        expect(levels.length, `${c.slug} / ${s.name} has no cutoffs`).toBeGreaterThan(0)
        for (let i = 1; i < levels.length; i++) expect(levels[i], `${c.slug} / ${s.name}`).toBeGreaterThan(levels[i - 1])
        for (const n of levels) expect(n, `${c.slug} / ${s.name}`).toBeLessThanOrEqual(4.3)
      }
    }
  })

  it('never has a lastChecked date in the future', () => {
    for (const c of colleges) expect(c.lastChecked <= today, c.slug).toBe(true)
  })

  it('sorts by name and finds by slug', () => {
    const names = colleges.map((c) => c.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    expect(getCollege(colleges[0].slug)).toBe(colleges[0])
  })
})
