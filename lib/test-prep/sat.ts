import { fail, ok, type Result } from '@/lib/result'
import { addRanges, estimateFromCurve, type Curve, type ScoreRange } from '@/lib/test-prep/curve'

export type { ScoreRange } from '@/lib/test-prep/curve'

/** Digital SAT and PSAT/NMSQT question counts per section. */
export const DIGITAL_QUESTIONS = { rw: 54, math: 44 } as const

/**
 * Our own approximate curve: fraction of questions correct → digital SAT section score. Anchored on
 * publicly reported practice-test results; not an official conversion table.
 */
const SAT_CURVE: Curve = [
  [0, 200],
  [0.1, 230],
  [0.25, 360],
  [0.5, 520],
  [0.75, 650],
  [0.9, 730],
  [1, 800],
]

type Estimate = Result<{ rw: ScoreRange; math: ScoreRange; total: ScoreRange }>

/** Estimates both sections on a 10-point scale, then adds them. Shared by the SAT and PSAT/NMSQT. */
export function estimateDigital(i: { rwCorrect: number; mathCorrect: number }, curve: Curve, min: number, max: number): Estimate {
  const scale = { min, max, step: 10, halfWidth: 30, minWidth: 40 }
  const rw = estimateFromCurve(i.rwCorrect, DIGITAL_QUESTIONS.rw, curve, scale, 'Reading and Writing')
  if (!rw.ok) return fail(rw.error)
  const math = estimateFromCurve(i.mathCorrect, DIGITAL_QUESTIONS.math, curve, scale, 'Math')
  if (!math.ok) return fail(math.error)
  return ok({ rw: rw.value, math: math.value, total: addRanges(rw.value, math.value) })
}

/** Digital SAT: each section 200–800, total 400–1600. */
export function estimateSat(i: { rwCorrect: number; mathCorrect: number }): Estimate {
  return estimateDigital(i, SAT_CURVE, 200, 800)
}
