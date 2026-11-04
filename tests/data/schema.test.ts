import { describe, expect, it } from 'vitest'

import { CollegeSchema, SourceSchema, StateSchema } from '@/lib/data/schema'
import college from './fixtures/college-valid.json'
import state from './fixtures/state-valid.json'

describe('data schemas', () => {
  it('parses a valid college', () => {
    expect(CollegeSchema.safeParse(college).success).toBe(true)
  })

  it('rejects a percentile college without academicYear', () => {
    const bad = { ...college, honors: { ...college.honors, basis: 'percentile' } }
    expect(CollegeSchema.safeParse(bad).success).toBe(false)
  })

  it('accepts a percentile college with academicYear', () => {
    const ok = { ...college, honors: { ...college.honors, basis: 'percentile', academicYear: '2024-25' } }
    expect(CollegeSchema.safeParse(ok).success).toBe(true)
  })

  it('parses a valid state', () => {
    expect(StateSchema.safeParse(state).success).toBe(true)
  })

  it('rejects a state whose subject credits exceed totalCredits', () => {
    const bad = { ...state, plans: [{ ...state.plans[0], totalCredits: 10 }] }
    expect(StateSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects a source with a non-URL', () => {
    expect(SourceSchema.safeParse({ label: 'x', url: 'not a url' }).success).toBe(false)
  })

  it('rejects a lastChecked that is not YYYY-MM-DD', () => {
    expect(CollegeSchema.safeParse({ ...college, lastChecked: 'Nov 2026' }).success).toBe(false)
  })
})
