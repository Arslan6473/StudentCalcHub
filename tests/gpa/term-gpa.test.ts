import { describe, expect, it } from 'vitest'

import { STANDARD_SCALE } from '@/lib/gpa/scale'
import { termGpa } from '@/lib/gpa/term-gpa'

const scale = STANDARD_SCALE

describe('termGpa', () => {
  it("reproduces UCLA's published example (A-, B-, C+ at 4 units)", () => {
    const r = termGpa(
      [
        { grade: 'A-', units: 4 },
        { grade: 'B-', units: 4 },
        { grade: 'C+', units: 4 },
      ],
      scale,
      [],
    )
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.value.totalPoints).toBeCloseTo(34.8, 10)
    expect(r.value.totalUnits).toBe(12)
    expect(r.value.gpa).toBeCloseTo(2.9, 10)
    expect(r.value.steps.length).toBeGreaterThan(0)
  })

  it('leaves non-GPA grades out of the average', () => {
    const r = termGpa(
      [
        { grade: 'A', units: 4 },
        { grade: 'P', units: 4 },
        { grade: 'W', units: 3 },
      ],
      scale,
      ['P', 'W'],
    )
    expect(r.ok && r.value).toMatchObject({ gpa: 4, totalUnits: 4, excluded: ['P', 'W'] })
  })

  it('fails when every course is a non-GPA grade', () => {
    expect(termGpa([{ grade: 'P', units: 4 }], scale, ['P']).ok).toBe(false)
  })

  it('fails on zero or negative units', () => {
    expect(termGpa([{ grade: 'A', units: 0 }], scale, []).ok).toBe(false)
    expect(termGpa([{ grade: 'A', units: -3 }], scale, []).ok).toBe(false)
  })

  it('fails naming a grade not on the scale', () => {
    const r = termGpa([{ grade: 'Q', units: 3 }], scale, [])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('Q')
  })
})
