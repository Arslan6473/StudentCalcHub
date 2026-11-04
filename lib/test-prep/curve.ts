import { fail, ok, type Result } from '@/lib/result'

export interface ScoreRange {
  low: number
  mid: number
  high: number
}

/** [fraction of questions correct, scaled score] anchor points, increasing in both. */
export type Curve = readonly (readonly [number, number])[]

interface Scale {
  min: number
  max: number
  step: number // scores are reported in multiples of this
  halfWidth: number // typical spread either side of the estimate
  minWidth: number // narrowest range we show, even at the ends of the scale
}

/** Piecewise-linear interpolation between curve anchors. */
function interpolate(curve: Curve, fraction: number): number {
  for (let i = 1; i < curve.length; i++) {
    const [x0, y0] = curve[i - 1]
    const [x1, y1] = curve[i]
    if (fraction <= x1) return y0 + ((fraction - x0) / (x1 - x0)) * (y1 - y0)
  }
  return curve[curve.length - 1][1]
}

/** Checks a raw count, then turns it into a low–mid–high scaled range on the given scale. */
export function estimateFromCurve(correct: number, questions: number, curve: Curve, scale: Scale, label: string): Result<ScoreRange> {
  if (!Number.isInteger(correct) || correct < 0 || correct > questions) {
    return fail(`${label}: enter a whole number of correct answers from 0 to ${questions}.`)
  }
  const snap = (n: number) => Math.min(scale.max, Math.max(scale.min, Math.round(n / scale.step) * scale.step))
  const mid = snap(interpolate(curve, correct / questions))
  let low = snap(mid - scale.halfWidth)
  let high = snap(mid + scale.halfWidth)
  if (high - low < scale.minWidth) {
    if (low === scale.min) high = low + scale.minWidth
    else low = high - scale.minWidth
  }
  return ok({ low, mid, high })
}

export const addRanges = (a: ScoreRange, b: ScoreRange): ScoreRange => ({ low: a.low + b.low, mid: a.mid + b.mid, high: a.high + b.high })
