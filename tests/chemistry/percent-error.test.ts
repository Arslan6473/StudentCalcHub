import { describe, expect, it } from 'vitest'

import { autoSigFigs, percentError } from '@/lib/chemistry/percent-error'

describe('percentError', () => {
  it('is |experimental − accepted| / |accepted| × 100', () => {
    const r = percentError({ experimental: 52.3, accepted: 50.0 })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.value.value).toBeCloseTo(4.6, 2)
    expect(r.value.absoluteError).toBeCloseTo(2.3, 6)
    expect(r.value.steps.length).toBeGreaterThanOrEqual(3)
  })

  it('keeps the sign when asked', () => {
    const r = percentError({ experimental: 47.7, accepted: 50.0, signed: true })
    expect(r.ok && r.value.value).toBeCloseTo(-4.6, 2)
  })

  it('is unsigned by default even when experimental is low', () => {
    const r = percentError({ experimental: 47.7, accepted: 50.0 })
    expect(r.ok && r.value.value).toBeCloseTo(4.6, 2)
  })

  it('rounds the display to the requested sig figs', () => {
    const r = percentError({ experimental: 52.3, accepted: 50.0, sigFigs: 2 })
    expect(r.ok && r.value.display).toBe('4.6%')
  })

  it('uses the accepted value magnitude for negative accepted values', () => {
    const r = percentError({ experimental: -9.0, accepted: -10.0 })
    expect(r.ok && r.value.value).toBeCloseTo(10, 6)
  })

  it('refuses an accepted value of 0 and points to percent difference', () => {
    const r = percentError({ experimental: 1, accepted: 0 })
    expect(r.ok).toBe(false)
    expect(!r.ok && r.error).toMatch(/percent difference/)
  })
})

describe('autoSigFigs (subtraction rule, then division)', () => {
  it('keeps 2 sig figs when the difference 2.3 has 2 (52.3 vs 50.0)', () => {
    const r = autoSigFigs('52.3', '50.0')
    expect(r.ok && r.value.n).toBe(2)
  })
  it('keeps 1 sig fig when the difference 0.1 has 1 (50.1 vs 50.0)', () => {
    const r = autoSigFigs('50.1', '50.0')
    expect(r.ok && r.value.n).toBe(1)
  })
  it('is limited by the accepted value when the difference is more precise', () => {
    // 152.3 − 50. = 102 (3 sig figs), but 50. has only 2
    const r = autoSigFigs('152.3', '50.')
    expect(r.ok && r.value.n).toBe(2)
  })
  it('falls back to 1 sig fig when the difference rounds to zero at the least precise place', () => {
    const r = autoSigFigs('9.81234', '9.8')
    expect(r.ok && r.value.n).toBe(1)
  })
  it('uses the least precise place for the difference (1500 vs 1234 → 300, 1 sig fig)', () => {
    const r = autoSigFigs('1500', '1234')
    expect(r.ok && r.value.n).toBe(1)
  })
  it('explains the rule in a step', () => {
    const r = autoSigFigs('52.3', '50.0')
    expect(r.ok && r.value.steps.map((s) => s.detail).join(' ')).toMatch(/2\.3/)
  })
  it('rejects input it cannot count', () => {
    expect(autoSigFigs('abc', '50.0').ok).toBe(false)
  })
})
