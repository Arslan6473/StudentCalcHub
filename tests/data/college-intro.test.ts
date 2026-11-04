import { describe, expect, it } from 'vitest'

import { collegeIntro } from '@/lib/data/college-intro'
import type { College } from '@/lib/data/schema'
import fixture from './fixtures/college-valid.json'

const base = fixture as unknown as College

describe('collegeIntro', () => {
  it('describes a fixed, single-school college', () => {
    const text = collegeIntro({ ...base, honors: { ...base.honors, schools: [{ ...base.honors.schools[0], extraRequirements: [] }] } })
    expect(text).toContain('Example')
    expect(text).toMatch(/3\.5/)
    expect(text).toMatch(/all undergraduates/i)
  })

  it('mentions the year for percentile honors', () => {
    const text = collegeIntro({ ...base, honors: { ...base.honors, basis: 'percentile', academicYear: '2025-26' } })
    expect(text).toContain('2025-26')
  })

  it('counts schools when cutoffs vary', () => {
    const school = { name: 'X', cumLaude: 3.5, extraRequirements: [] }
    const text = collegeIntro({ ...base, honors: { ...base.honors, schools: [school, { ...school, name: 'Y' }, { ...school, name: 'Z' }] } })
    expect(text).toMatch(/3 schools/)
  })
})
