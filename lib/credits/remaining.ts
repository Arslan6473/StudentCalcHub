import type { GraduationPlan } from '@/lib/data/schema'

export interface CreditsRemaining {
  totalRequired: number
  totalEarned: number
  totalRemaining: number
  bySubject: { key: string; label: string; required: number; earned: number; remaining: number }[]
}

/**
 * Credits left to graduate on one plan. Credits above a subject's requirement
 * still count toward the total (as electives), capped at the plan's total; but
 * the remaining total is never less than the required-subject credits still owed.
 */
export function creditsRemaining(
  plan: Pick<GraduationPlan, 'totalCredits' | 'subjects'>,
  earned: Record<string, number>,
): CreditsRemaining {
  const bySubject = plan.subjects.map((s) => {
    const got = Math.max(0, earned[s.key] ?? 0)
    return { key: s.key, label: s.label, required: s.credits, earned: got, remaining: Math.max(0, s.credits - got) }
  })
  const sumEarned = Object.values(earned).reduce((sum, n) => sum + Math.max(0, n || 0), 0)
  const totalEarned = Math.min(sumEarned, plan.totalCredits)
  return {
    totalRequired: plan.totalCredits,
    totalEarned,
    // Electives can't stand in for a missing required subject.
    totalRemaining: Math.max(
      plan.totalCredits - totalEarned,
      bySubject.reduce((sum, s) => sum + s.remaining, 0),
    ),
    bySubject,
  }
}
