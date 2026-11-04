import { describe, expect, it } from 'vitest'

import { molarity, solveDilution } from '@/lib/chemistry/molarity'

describe('molarity', () => {
  it('uses grams and a formula', () => {
    const r = molarity({ grams: 5.844, formula: 'NaCl', volumeL: 0.5 })
    expect(r.ok && r.value.molarity).toBeCloseTo(0.2, 3)
  })

  it('uses moles directly', () => {
    const r = molarity({ moles: 0.25, volumeL: 0.5 })
    expect(r.ok && r.value.molarity).toBeCloseTo(0.5, 9)
  })

  it('rejects a zero volume', () => {
    expect(molarity({ moles: 1, volumeL: 0 }).ok).toBe(false)
  })

  it('needs either moles or grams plus a formula', () => {
    expect(molarity({ volumeL: 1 }).ok).toBe(false)
    expect(molarity({ grams: 5, volumeL: 1 }).ok).toBe(false)
  })

  it('passes formula errors through', () => {
    const r = molarity({ grams: 5, formula: 'nacl', volumeL: 1 })
    expect(!r.ok && r.error).toMatch(/capital/)
  })
})

describe('solveDilution', () => {
  it('solves for the missing volume', () => {
    const r = solveDilution({ c1: 2, v1: 0.05, c2: 0.5 })
    expect(r.ok && r.value.solvedFor).toBe('v2')
    expect(r.ok && r.value.value).toBeCloseTo(0.2, 9)
    expect(r.ok && r.value.warning).toBeUndefined()
  })

  it('solves for each unknown', () => {
    expect(solveDilution({ v1: 0.05, c2: 0.5, v2: 0.2 })).toMatchObject({ ok: true, value: { solvedFor: 'c1', value: 2 } })
    const v1 = solveDilution({ c1: 2, c2: 0.5, v2: 0.2 })
    expect(v1.ok && v1.value.value).toBeCloseTo(0.05, 9)
  })

  it('needs exactly three values', () => {
    expect(solveDilution({ c1: 1, v1: 1, c2: 1, v2: 1 }).ok).toBe(false)
    expect(solveDilution({ c1: 1, v1: 1 }).ok).toBe(false)
  })

  it('rejects zero or negative values', () => {
    expect(solveDilution({ c1: 0, v1: 1, c2: 1 }).ok).toBe(false)
    expect(solveDilution({ c1: 1, v1: -1, c2: 1 }).ok).toBe(false)
  })

  it('warns when the concentration goes up', () => {
    const r = solveDilution({ c1: 1, v1: 1, v2: 0.5 })
    expect(r.ok && r.value.value).toBeCloseTo(2, 9)
    expect(r.ok && r.value.warning).toMatch(/not a dilution/i)
  })
})
