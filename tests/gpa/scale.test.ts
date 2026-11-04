import { describe, expect, it } from 'vitest'

import { formatPoints, gradeOptionLabel, letterToPoints, percentToLetter, pointsToLetter, STANDARD_SCALE } from '@/lib/gpa/scale'

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

describe('formatPoints', () => {
  it('keeps published precision', () => {
    expect(formatPoints(4)).toBe('4.0')
    expect(formatPoints(3.67)).toBe('3.67')
    expect(formatPoints(3.3)).toBe('3.3')
  })
})

describe('gradeOptionLabel', () => {
  it('shows letter and points for letter grades', () => {
    expect(gradeOptionLabel('A-', 3.67)).toBe('A- (3.67)')
  })
  it('shows a numeric grade once when it equals its points (UW-style)', () => {
    expect(gradeOptionLabel('3.7', 3.7)).toBe('3.7')
    expect(gradeOptionLabel('4.0', 4)).toBe('4.0')
  })
})
