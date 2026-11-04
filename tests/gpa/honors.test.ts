import { describe, expect, it } from 'vitest'

import { qualifyHonors } from '@/lib/gpa/honors'

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
