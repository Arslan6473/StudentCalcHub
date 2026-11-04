import { describe, expect, it } from 'vitest'

import { convertGpa, convertLetter, convertPercent, percentRange } from '@/lib/gpa/convert'

describe('percentRange', () => {
  it('gives each letter its band on the standard scale', () => {
    expect(percentRange('A+')).toBe('97–100%')
    expect(percentRange('A')).toBe('93–96%')
    expect(percentRange('B+')).toBe('87–89%')
    expect(percentRange('F')).toBe('below 65%')
  })
})

describe('convertPercent', () => {
  it('turns 89.9 into B+ / 3.3 with steps', () => {
    const r = convertPercent('89.9')
    expect(r.ok && r.value).toMatchObject({ letter: 'B+', points: 3.3 })
    expect(r.ok && r.value.steps.length).toBeGreaterThan(0)
  })

  it('asks for a number on blank input', () => {
    expect(convertPercent('  ').ok).toBe(false)
  })

  it('rejects negative percentages', () => {
    expect(convertPercent('-5').ok).toBe(false)
  })

  it('treats over 100% (extra credit) as A+', () => {
    expect(convertPercent('104').ok && convertPercent('104')).toMatchObject({ value: { letter: 'A+' } })
  })
})

describe('convertLetter', () => {
  it('reads lowercase letters', () => {
    const r = convertLetter(' b- ')
    expect(r.ok && r.value).toMatchObject({ letter: 'B-', points: 2.7, range: '80–82%' })
  })

  it('rejects letters not on the scale', () => {
    const r = convertLetter('E')
    expect(r.ok).toBe(false)
  })
})

describe('convertGpa', () => {
  it('turns 3.5 into B+ with its band', () => {
    expect(convertGpa('3.5').ok && convertGpa('3.5')).toMatchObject({ value: { letter: 'B+', range: '87–89%' } })
  })

  it('rejects a GPA above 4.0 and explains weighting', () => {
    const r = convertGpa('4.3')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/weighted/i)
  })
})
