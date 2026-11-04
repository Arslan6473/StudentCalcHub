import type { Result } from '@/lib/result'
import type { Curve, ScoreRange } from '@/lib/test-prep/curve'
import { estimateDigital } from '@/lib/test-prep/sat'

/** Our own approximate PSAT/NMSQT curve on the 160–760 section scale; not an official table. */
const PSAT_CURVE: Curve = [
  [0, 160],
  [0.1, 190],
  [0.25, 320],
  [0.5, 480],
  [0.75, 610],
  [0.9, 690],
  [1, 760],
]

/** PSAT/NMSQT: each section 160–760, total 320–1520. */
export function estimatePsat(i: { rwCorrect: number; mathCorrect: number }): Result<{ rw: ScoreRange; math: ScoreRange; total: ScoreRange }> {
  return estimateDigital(i, PSAT_CURVE, 160, 760)
}

/** National Merit Selection Index = (2 × Reading and Writing + Math) ÷ 10, range 48–228. */
export function selectionIndex(rw: number, math: number): number {
  return (2 * rw + math) / 10
}
