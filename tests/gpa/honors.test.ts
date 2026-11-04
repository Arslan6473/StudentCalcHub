import { describe, expect, it } from 'vitest'

import { nextHonor, qualifyHonors } from '@/lib/gpa/honors'

const cutoffs = { cumLaude: 3.6, magnaCumLaude: 3.8, summaCumLaude: 3.9 }

describe('qualifyHonors', () => {
  it('treats cutoffs as inclusive', () => {
    expect(qualifyHonors(3.8, cutoffs)).toBe('magna cum laude')
    expect(qualifyHonors(3.9, cutoffs)).toBe('summa cum laude')
  })

  it('returns null below the lowest cutoff', () => {
    expect(qualifyHonors(3.59, cutoffs)).toBeNull()
  })

  it('only awards levels the college defines', () => {
    expect(qualifyHonors(3.95, { cumLaude: 3.5 })).toBe('cum laude')
  })
})

describe('nextHonor', () => {
  it('names the next level up and the GPA gap', () => {
    const n = nextHonor(3.75, cutoffs)
    expect(n?.level).toBe('magna cum laude')
    expect(n?.gap).toBeCloseTo(0.05, 10)
  })

  it('returns the lowest level when below every cutoff', () => {
    expect(nextHonor(3.0, cutoffs)?.level).toBe('cum laude')
  })

  it('returns null at the top level', () => {
    expect(nextHonor(3.95, cutoffs)).toBeNull()
  })

  it('skips levels the college does not award', () => {
    expect(nextHonor(3.4, { cumLaude: 3.5, summaCumLaude: 3.9 })?.level).toBe('cum laude')
    expect(nextHonor(3.6, { cumLaude: 3.5, summaCumLaude: 3.9 })?.level).toBe('summa cum laude')
  })
})
