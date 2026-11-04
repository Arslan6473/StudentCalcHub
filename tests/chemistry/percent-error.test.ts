import { describe, expect, it } from 'vitest'

import { percentError } from '@/lib/chemistry/percent-error'

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
