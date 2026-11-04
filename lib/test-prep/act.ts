import type { Result } from '@/lib/result'
import { estimateFromCurve, type Curve, type ScoreRange } from '@/lib/test-prep/curve'

/** Enhanced ACT question counts. Science is optional and not part of the composite. */
export const ACT_QUESTIONS = { english: 50, math: 45, reading: 36, science: 40 } as const

export type ActSection = keyof typeof ACT_QUESTIONS

const LABELS: Record<ActSection, string> = { english: 'English', math: 'Math', reading: 'Reading', science: 'Science' }

/** Our own approximate curve: fraction correct → 1–36 section score. Not an official ACT table. */
const ACT_CURVE: Curve = [
  [0, 1],
  [0.1, 8],
  [0.25, 13],
  [0.5, 19],
  [0.75, 26],
  [0.9, 31],
  [1, 36],
]

export function estimateActSection(section: ActSection, correct: number): Result<ScoreRange> {
  return estimateFromCurve(correct, ACT_QUESTIONS[section], ACT_CURVE, { min: 1, max: 36, step: 1, halfWidth: 1, minWidth: 2 }, LABELS[section])
}

/** Composite = mean of English, Math and Reading, with .5 rounding up. */
export function actComposite(english: number, math: number, reading: number): number {
  return Math.round((english + math + reading) / 3)
}

/** STEM score = mean of Math and Science, with .5 rounding up. */
export function actStem(math: number, science: number): number {
  return Math.round((math + science) / 2)
}
