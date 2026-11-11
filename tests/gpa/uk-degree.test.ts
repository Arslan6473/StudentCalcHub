import { describe, expect, it } from 'vitest'

import { classify, ukDegreeClassification } from '@/lib/gpa/uk-degree'

const year2 = {
  label: 'Year 2',
  weight: 1,
  modules: [
    { credits: 40, mark: 58 },
    { credits: 40, mark: 64 },
    { credits: 40, mark: 61 },
  ],
}
const year3 = {
  label: 'Year 3',
  weight: 2,
  modules: [
    { credits: 40, mark: 72, name: 'Dissertation' },
    { credits: 40, mark: 66 },
    { credits: 40, mark: 69 },
  ],
}

describe('classify', () => {
  it('uses the usual 70/60/50/40 boundaries', () => {
    expect(classify(70).short).toBe('First')
    expect(classify(69.99).short).toBe('2:1')
    expect(classify(60).short).toBe('2:1')
    expect(classify(59.9).short).toBe('2:2')
    expect(classify(50).short).toBe('2:2')
    expect(classify(40).short).toBe('Third')
    expect(classify(39.9).short).toBe('Fail')
  })
})

describe('ukDegreeClassification', () => {
  it('reproduces the worked example (1 : 2 weighting)', () => {
    const r = ukDegreeClassification([year2, year3])
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.value.years[0].average).toBeCloseTo(61, 10)
    expect(r.value.years[1].average).toBeCloseTo(69, 10)
    expect(r.value.years[1].share).toBeCloseTo(2 / 3, 10)
    expect(r.value.overall).toBeCloseTo(66.3333, 4)
    expect(r.value.classification.short).toBe('2:1')
    expect(r.value.borderline).toBeNull()
    expect(r.value.steps.length).toBeGreaterThan(0)
  })

  it('weights by credits within a year', () => {
    const r = ukDegreeClassification([
      {
        label: 'Year 3',
        weight: 1,
        modules: [
          { credits: 40, mark: 80 },
          { credits: 20, mark: 50 },
        ],
      },
    ])
    expect(r.ok && r.value.overall).toBeCloseTo(70, 10)
  })

  it('treats 40/60 the same as 2 : 3', () => {
    const a = ukDegreeClassification([
      { ...year2, weight: 40 },
      { ...year3, weight: 60 },
    ])
    const b = ukDegreeClassification([
      { ...year2, weight: 2 },
      { ...year3, weight: 3 },
    ])
    expect(a.ok && b.ok).toBe(true)
    if (!a.ok || !b.ok) return
    expect(a.value.overall).toBeCloseTo(b.value.overall, 10)
    expect(a.value.overall).toBeCloseTo(65.8, 10)
  })

  it('flags an average just under a boundary as borderline', () => {
    const r = ukDegreeClassification([{ ...year3, weight: 1 }])
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.value.overall).toBeCloseTo(69, 10)
    expect(r.value.classification.short).toBe('2:1')
    expect(r.value.borderline?.next.short).toBe('First')
    expect(r.value.borderline?.gap).toBeCloseTo(1, 10)
  })

  it('ignores a year weighted 0', () => {
    const r = ukDegreeClassification([{ ...year2, weight: 0 }, year3])
    expect(r.ok && r.value.overall).toBeCloseTo(69, 10)
  })

  it('fails on invalid input', () => {
    expect(ukDegreeClassification([]).ok).toBe(false)
    expect(ukDegreeClassification([{ ...year3, weight: 0 }]).ok).toBe(false)
    expect(ukDegreeClassification([{ ...year3, weight: -1 }]).ok).toBe(false)
    expect(ukDegreeClassification([{ label: 'Year 3', weight: 1, modules: [] }]).ok).toBe(false)
    expect(
      ukDegreeClassification([{ label: 'Year 3', weight: 1, modules: [{ credits: 0, mark: 60 }] }])
        .ok
    ).toBe(false)
    expect(
      ukDegreeClassification([
        { label: 'Year 3', weight: 1, modules: [{ credits: 20, mark: 101 }] },
      ]).ok
    ).toBe(false)
    expect(
      ukDegreeClassification([{ label: 'Year 3', weight: 1, modules: [{ credits: 20, mark: -5 }] }])
        .ok
    ).toBe(false)
  })

  it('names the module in error messages', () => {
    const r = ukDegreeClassification([
      { label: 'Year 3', weight: 1, modules: [{ credits: 20, mark: 120, name: 'Dissertation' }] },
    ])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('Dissertation')
  })
})
