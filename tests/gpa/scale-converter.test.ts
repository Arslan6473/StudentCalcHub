import { describe, expect, it } from 'vitest'

import {
  convertScale,
  germanGrade,
  linearConvert,
  truncateOneDecimal,
} from '@/lib/gpa/scale-converter'

describe('linearConvert', () => {
  it('maps proportionally between zero-based scales', () => {
    expect(linearConvert(3.2, { min: 0, max: 4 }, { min: 0, max: 100 })).toBeCloseTo(80)
    expect(linearConvert(8.5, { min: 0, max: 10 }, { min: 0, max: 4 })).toBeCloseTo(3.4)
  })

  it('respects a non-zero minimum', () => {
    expect(linearConvert(3, { min: 1, max: 5 }, { min: 0, max: 100 })).toBeCloseTo(50)
  })
})

describe('germanGrade (modified Bavarian formula)', () => {
  it('gives 1.0 for the top grade and 4.0 for the pass mark', () => {
    expect(germanGrade(20, 20, 10)).toBe(1)
    expect(germanGrade(10, 20, 10)).toBe(4)
  })

  it('matches hand-worked values', () => {
    expect(germanGrade(14, 20, 10)).toBeCloseTo(2.8)
    expect(germanGrade(6, 7, 4)).toBeCloseTo(2)
    expect(germanGrade(3.5, 4, 1)).toBeCloseTo(1.5)
    expect(germanGrade(85, 100, 40)).toBeCloseTo(1.75)
  })
})

describe('truncateOneDecimal', () => {
  it('cuts instead of rounding, without float slips', () => {
    expect(truncateOneDecimal(1.75)).toBe(1.7)
    expect(truncateOneDecimal(2.99)).toBe(2.9)
    expect(truncateOneDecimal(1 + (3 * (7 - 6)) / (7 - 4))).toBe(2)
  })
})

describe('convertScale — linear', () => {
  it('converts a 4.0 GPA to a percentage with steps', () => {
    const r = convertScale({ value: '3.2', from: 'us4', to: 'percent' })
    expect(r.ok && r.value).toMatchObject({ display: '80.0', method: 'linear' })
    expect(r.ok && r.value.steps.length).toBeGreaterThan(0)
  })

  it('converts a 10-point CGPA to the 4.0 scale', () => {
    const r = convertScale({ value: '8.5', from: 'ten', to: 'us4' })
    expect(r.ok && r.value.display).toBe('3.40')
  })

  it('converts French 14/20 to the Australian 7-point scale', () => {
    const r = convertScale({ value: '14', from: 'fr20', to: 'au7' })
    expect(r.ok && r.value.display).toBe('4.90')
  })

  it('uses custom bounds on either side', () => {
    const r = convertScale({
      value: '3',
      from: 'custom',
      to: 'percent',
      custom: { min: '1', max: '5' },
    })
    expect(r.ok && r.value.display).toBe('50.0')
  })
})

describe('convertScale — German', () => {
  it('applies the formula and truncates to one decimal', () => {
    const r = convertScale({ value: '85', from: 'percent', to: 'german', passing: '40' })
    expect(r.ok && r.value).toMatchObject({
      value: 1.7,
      display: '1.7',
      method: 'bavarian',
      failing: false,
    })
  })

  it('gives 2.8 for 14/20 with a pass mark of 10', () => {
    const r = convertScale({ value: '14', from: 'fr20', to: 'german', passing: '10' })
    expect(r.ok && r.value.display).toBe('2.8')
  })

  it('marks a grade below the pass mark as a fail', () => {
    const r = convertScale({ value: '3', from: 'au7', to: 'german', passing: '4' })
    expect(r.ok && r.value).toMatchObject({ display: 'Fail', failing: true })
  })
})

describe('convertScale — validation', () => {
  it('rejects blank and non-numeric grades', () => {
    expect(convertScale({ value: ' ', from: 'us4', to: 'percent' }).ok).toBe(false)
    expect(convertScale({ value: 'abc', from: 'us4', to: 'percent' }).ok).toBe(false)
  })

  it('rejects a grade outside the source scale', () => {
    const r = convertScale({ value: '4.3', from: 'us4', to: 'percent' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/between 0 and 4/)
    expect(convertScale({ value: '-1', from: 'percent', to: 'us4' }).ok).toBe(false)
  })

  it('requires the custom minimum to be below the maximum', () => {
    const r = convertScale({
      value: '3',
      from: 'custom',
      to: 'us4',
      custom: { min: '5', max: '5' },
    })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/above its lowest/)
  })

  it('requires a pass mark below the top grade for the German conversion', () => {
    expect(convertScale({ value: '14', from: 'fr20', to: 'german', passing: '' }).ok).toBe(false)
    expect(convertScale({ value: '14', from: 'fr20', to: 'german', passing: '20' }).ok).toBe(false)
    expect(convertScale({ value: '14', from: 'fr20', to: 'german', passing: '-1' }).ok).toBe(false)
  })
})
