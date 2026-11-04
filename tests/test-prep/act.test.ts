import { describe, expect, it } from 'vitest'

import { ACT_QUESTIONS, actComposite, actStem, estimateActSection } from '@/lib/test-prep/act'

describe('ACT_QUESTIONS', () => {
  it('matches the enhanced ACT', () => {
    expect(ACT_QUESTIONS).toEqual({ english: 50, math: 45, reading: 36, science: 40 })
  })
})

describe.each(Object.entries(ACT_QUESTIONS) as [keyof typeof ACT_QUESTIONS, number][])('estimateActSection(%s)', (section, total) => {
  const at = (c: number) => {
    const r = estimateActSection(section, c)
    if (!r.ok) throw new Error(r.error)
    return r.value
  }

  it('maps 0 correct to 1 and all correct to 36', () => {
    expect(at(0).mid).toBe(1)
    expect(at(0).low).toBe(1)
    expect(at(total).mid).toBe(36)
    expect(at(total).high).toBe(36)
  })

  it('is non-decreasing with a 2–4 point range of whole numbers', () => {
    for (let c = 0; c <= total; c++) {
      const v = at(c)
      if (c > 0) expect(v.mid).toBeGreaterThanOrEqual(at(c - 1).mid)
      expect(Number.isInteger(v.low) && Number.isInteger(v.mid) && Number.isInteger(v.high)).toBe(true)
      expect(v.low).toBeGreaterThanOrEqual(1)
      expect(v.high).toBeLessThanOrEqual(36)
      expect(v.high - v.low).toBeGreaterThanOrEqual(2)
      expect(v.high - v.low).toBeLessThanOrEqual(4)
    }
  })

  it('rejects counts outside 0 to the question total', () => {
    expect(estimateActSection(section, total + 1).ok).toBe(false)
    expect(estimateActSection(section, -1).ok).toBe(false)
    expect(estimateActSection(section, 1.5).ok).toBe(false)
  })
})

describe('actComposite', () => {
  it('averages English, Math and Reading and rounds .5 up', () => {
    expect(actComposite(30, 31, 32)).toBe(31)
    expect(actComposite(30, 31, 31)).toBe(31)
    expect(actComposite(30, 30, 31)).toBe(30)
  })
})

describe('actStem', () => {
  it('averages Math and Science and rounds .5 up', () => {
    expect(actStem(30, 31)).toBe(31)
    expect(actStem(30, 30)).toBe(30)
  })
})
