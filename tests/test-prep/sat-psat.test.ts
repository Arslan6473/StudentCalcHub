import { describe, expect, it } from 'vitest'

import { estimatePsat, selectionIndex } from '@/lib/test-prep/psat'
import { estimateSat } from '@/lib/test-prep/sat'

const estimators = [
  { name: 'SAT', fn: estimateSat, min: 200, max: 800 },
  { name: 'PSAT/NMSQT', fn: estimatePsat, min: 160, max: 760 },
] as const

describe.each(estimators)('$name estimate', ({ fn, min, max }) => {
  const at = (rw: number, math: number) => {
    const r = fn({ rwCorrect: rw, mathCorrect: math })
    if (!r.ok) throw new Error(r.error)
    return r.value
  }

  it('gives the section minimum for 0 correct', () => {
    const v = at(0, 0)
    expect(v.rw.low).toBe(min)
    expect(v.rw.mid).toBe(min)
    expect(v.math.mid).toBe(min)
    expect(v.total.mid).toBe(2 * min)
  })

  it('gives the section maximum for all correct', () => {
    const v = at(54, 44)
    expect(v.rw.mid).toBe(max)
    expect(v.rw.high).toBe(max)
    expect(v.math.mid).toBe(max)
    expect(v.total.high).toBe(2 * max)
  })

  it('never goes down as more answers are correct', () => {
    for (let c = 1; c <= 54; c++) expect(at(c, 0).rw.mid).toBeGreaterThanOrEqual(at(c - 1, 0).rw.mid)
    for (let c = 1; c <= 44; c++) expect(at(0, c).math.mid).toBeGreaterThanOrEqual(at(0, c - 1).math.mid)
  })

  it('reports multiples of 10 inside the section bounds, with a 40–80 point range', () => {
    for (let c = 0; c <= 54; c++) {
      const { rw } = at(c, 0)
      for (const s of [rw.low, rw.mid, rw.high]) {
        expect(s % 10).toBe(0)
        expect(s).toBeGreaterThanOrEqual(min)
        expect(s).toBeLessThanOrEqual(max)
      }
      expect(rw.low).toBeLessThanOrEqual(rw.mid)
      expect(rw.mid).toBeLessThanOrEqual(rw.high)
      expect(rw.high - rw.low).toBeGreaterThanOrEqual(40)
      expect(rw.high - rw.low).toBeLessThanOrEqual(80)
    }
  })

  it('totals the two sections', () => {
    const v = at(30, 25)
    expect(v.total.mid).toBe(v.rw.mid + v.math.mid)
  })

  it.each([
    { rwCorrect: 55, mathCorrect: 0 },
    { rwCorrect: -1, mathCorrect: 0 },
    { rwCorrect: 0, mathCorrect: 45 },
    { rwCorrect: 10.5, mathCorrect: 0 },
    { rwCorrect: Number.NaN, mathCorrect: 0 },
  ])('rejects %o', (input) => {
    expect(fn(input).ok).toBe(false)
  })
})

describe('selectionIndex', () => {
  it('is (2 × RW + Math) ÷ 10', () => {
    expect(selectionIndex(700, 700)).toBe(210)
    expect(selectionIndex(760, 760)).toBe(228)
    expect(selectionIndex(160, 160)).toBe(48)
    expect(selectionIndex(690, 720)).toBe(210)
  })
})
