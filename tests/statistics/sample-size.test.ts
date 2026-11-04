import { describe, expect, it } from 'vitest'

import { sampleSizeMean, sampleSizeProportion, Z_SCORES } from '@/lib/statistics/sample-size'

describe('Z_SCORES', () => {
  it('holds the two-sided critical values', () => {
    expect(Z_SCORES).toEqual({ '80': 1.2816, '85': 1.4395, '90': 1.6449, '95': 1.96, '98': 2.3263, '99': 2.5758 })
  })
})

describe('sampleSizeProportion', () => {
  it('gives 385 at 95% confidence and a 5% margin with p = 0.5', () => {
    const r = sampleSizeProportion({ confidence: '95', marginOfError: 0.05 })
    expect(r.ok && r.value.n).toBe(385)
    expect(r.ok && r.value.steps.length).toBeGreaterThanOrEqual(2)
  })

  it('applies the finite population correction', () => {
    const r = sampleSizeProportion({ confidence: '95', marginOfError: 0.05, population: 1000 })
    expect(r.ok && r.value.n).toBe(278)
    expect(r.ok && r.value.nInfinite).toBe(385)
  })

  it('gives 1843 at 99% confidence and a 3% margin', () => {
    const r = sampleSizeProportion({ confidence: '99', marginOfError: 0.03 })
    expect(r.ok && r.value.n).toBe(1843)
  })

  it('needs fewer people when p is far from 0.5', () => {
    const r = sampleSizeProportion({ confidence: '95', marginOfError: 0.05, p: 0.1 })
    expect(r.ok && r.value.n).toBe(139)
  })

  it.each([
    [{ marginOfError: 0 }],
    [{ marginOfError: 1 }],
    [{ marginOfError: 0.05, p: 0 }],
    [{ marginOfError: 0.05, p: 1 }],
    [{ marginOfError: 0.05, population: 0 }],
    [{ marginOfError: Number.NaN }],
  ])('rejects %o', (extra) => {
    expect(sampleSizeProportion({ confidence: '95', ...extra }).ok).toBe(false)
  })
})

describe('sampleSizeMean', () => {
  it('gives 97 at 95% confidence, margin 2, sd 10', () => {
    const r = sampleSizeMean({ confidence: '95', marginOfError: 2, sd: 10 })
    expect(r.ok && r.value.n).toBe(97)
  })

  it.each([
    [{ marginOfError: 0, sd: 10 }],
    [{ marginOfError: 2, sd: 0 }],
    [{ marginOfError: 2, sd: -1 }],
    [{ marginOfError: 2, sd: 10, population: 0.5 }],
  ])('rejects %o', (extra) => {
    expect(sampleSizeMean({ confidence: '95', ...extra }).ok).toBe(false)
  })
})
