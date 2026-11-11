import { describe, expect, it } from 'vitest'

import { CGPA_PRESETS, cgpaToPercent, findPreset, formatNumber, parseFormula, percentToCgpa } from '@/lib/gpa/cgpa'

const CBSE = { multiplier: 9.5, offset: 0 }
const OFFSET = { multiplier: 10, offset: 0.75 }

describe('presets', () => {
  it('match the published formulas', () => {
    expect(findPreset('cbse')?.formula).toEqual({ multiplier: 9.5, offset: 0 })
    expect(findPreset('iisc')?.formula).toEqual({ multiplier: 10, offset: 0 })
    expect(findPreset('cotton')?.formula).toEqual({ multiplier: 10, offset: 0 })
    expect(findPreset('mit-adt')?.formula).toEqual({ multiplier: 9.56, offset: 0 })
  })

  it('each cite an https source', () => {
    for (const p of CGPA_PRESETS) expect(p.source.url).toMatch(/^https:\/\//)
  })
})

describe('formatNumber', () => {
  it('hides floating-point noise and trailing zeros', () => {
    expect(formatNumber(8.6 * 9.5)).toBe('81.7')
    expect(formatNumber(90.25)).toBe('90.25')
    expect(formatNumber(80)).toBe('80')
  })
})

describe('cgpaToPercent', () => {
  it('turns a CBSE 9.5 into 90.25% with steps', () => {
    const r = cgpaToPercent('9.5', CBSE)
    expect(r.ok && r.value.percent).toBeCloseTo(90.25)
    expect(r.ok && r.value.steps.map((s) => s.detail)).toContain('9.5 × 9.5')
  })

  it('applies an offset formula', () => {
    const r = cgpaToPercent('8.6', OFFSET)
    expect(r.ok && r.value.percent).toBeCloseTo(78.5)
    expect(r.ok && r.value.steps[1].detail).toBe('(8.6 − 0.75) × 10 = 7.85 × 10')
  })

  it('asks for a number on blank input', () => {
    expect(cgpaToPercent(' ', CBSE).ok).toBe(false)
  })

  it('rejects a CGPA outside 0–10', () => {
    expect(cgpaToPercent('-1', CBSE).ok).toBe(false)
    expect(cgpaToPercent('10.1', CBSE).ok).toBe(false)
    expect(cgpaToPercent('10', CBSE).ok).toBe(true)
  })

  it('rejects a formula that gives over 100% or below 0%', () => {
    expect(cgpaToPercent('10', { multiplier: 12.5, offset: 0 }).ok).toBe(false)
    expect(cgpaToPercent('0.5', OFFSET).ok).toBe(false)
  })
})

describe('percentToCgpa', () => {
  it('reverses the CBSE formula', () => {
    const r = percentToCgpa('85.5', CBSE)
    expect(r.ok && r.value.cgpa).toBeCloseTo(9)
    expect(r.ok && r.value.steps.at(-1)?.detail).toBe('85.5 ÷ 9.5 = 9')
  })

  it('reverses an offset formula', () => {
    const r = percentToCgpa('78.5', OFFSET)
    expect(r.ok && r.value.cgpa).toBeCloseTo(8.6)
  })

  it('round-trips with the forward conversion', () => {
    const forward = cgpaToPercent('7.3', { multiplier: 9.56, offset: 0 })
    const back = forward.ok && percentToCgpa(String(forward.value.percent), { multiplier: 9.56, offset: 0 })
    expect(back && back.ok && back.value.cgpa).toBeCloseTo(7.3)
  })

  it('explains when the percentage is above what the formula can reach', () => {
    const r = percentToCgpa('97', CBSE)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('95%')
  })

  it('rejects a percentage outside 0–100', () => {
    expect(percentToCgpa('-3', CBSE).ok).toBe(false)
    expect(percentToCgpa('101', CBSE).ok).toBe(false)
  })

  it('rejects a percentage that works out below CGPA 0', () => {
    expect(percentToCgpa('5', { multiplier: 10, offset: -1 }).ok).toBe(false)
  })
})

describe('parseFormula', () => {
  it('reads a multiplier and offset', () => {
    expect(parseFormula('10', '0.75')).toEqual({ ok: true, value: { multiplier: 10, offset: 0.75 } })
  })

  it('treats a blank offset as 0', () => {
    expect(parseFormula('9.5', '')).toEqual({ ok: true, value: { multiplier: 9.5, offset: 0 } })
  })

  it('rejects a zero or negative multiplier', () => {
    expect(parseFormula('0', '0').ok).toBe(false)
    expect(parseFormula('-2', '0').ok).toBe(false)
  })

  it('rejects an offset outside ±10', () => {
    expect(parseFormula('10', '12').ok).toBe(false)
  })
})
