import { describe, expect, it } from 'vitest'

import { creditsRemaining } from '@/lib/credits/remaining'

const plan = {
  name: 'Standard',
  totalCredits: 22,
  subjects: [
    { key: 'english', label: 'English', credits: 4 },
    { key: 'math', label: 'Math', credits: 4 },
    { key: 'science', label: 'Science', credits: 3 },
  ],
}

describe('creditsRemaining', () => {
  it('computes per-subject and total remaining', () => {
    const r = creditsRemaining(plan, { english: 4, math: 2 })
    expect(r.bySubject.find((s) => s.key === 'math')?.remaining).toBe(2)
    expect(r.bySubject.find((s) => s.key === 'english')?.remaining).toBe(0)
    expect(r.totalRequired).toBe(22)
    expect(r.totalEarned).toBe(6)
    expect(r.totalRemaining).toBe(16)
  })

  it('never reports a negative remaining', () => {
    const r = creditsRemaining(plan, { english: 6, math: 30 })
    expect(r.bySubject.every((s) => s.remaining >= 0)).toBe(true)
    expect(r.totalEarned).toBe(22)
  })

  it('still requires missing subjects when the total is already met', () => {
    // 22 credits earned, but Science (3) is untouched — those 3 are still owed.
    const r = creditsRemaining(plan, { english: 6, math: 16 })
    expect(r.totalRemaining).toBe(3)
  })

  it('counts extra subject credits toward the total as electives', () => {
    const r = creditsRemaining(plan, { english: 6 })
    expect(r.totalEarned).toBe(6)
    expect(r.totalRemaining).toBe(16)
  })
})
