import { describe, expect, it } from 'vitest'

import { letterToPoints, percentToLetter, pointsToLetter, STANDARD_SCALE } from '@/lib/gpa/scale'

describe('standard scale conversions', () => {
  it('reads letters case-insensitively and trimmed', () => {
    expect(letterToPoints(' b+ ')).toBe(3.3)
  })

  it('counts A+ as 4.0', () => {
    expect(letterToPoints('A+')).toBe(4)
  })

  it('returns null for a grade not on the scale', () => {
    expect(letterToPoints('P')).toBeNull()
  })

  it('maps percentages to letters at band edges', () => {
    expect(percentToLetter(89.9)).toBe('B+')
    expect(percentToLetter(90)).toBe('A-')
    expect(percentToLetter(64)).toBe('F')
    expect(percentToLetter(100)).toBe('A+')
  })

  it('maps points to the highest letter at or below them', () => {
    expect(pointsToLetter(3.5)).toBe('B+')
    expect(pointsToLetter(4)).toBe('A')
    expect(pointsToLetter(0.5)).toBe('F')
  })

  it('has 12 rows in descending order', () => {
    expect(STANDARD_SCALE).toHaveLength(12)
    expect(STANDARD_SCALE.map((r) => r.minPercent)).toEqual([97, 93, 90, 87, 83, 80, 77, 73, 70, 67, 65, 0])
  })
})
