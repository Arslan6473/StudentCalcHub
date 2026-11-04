import { countSigFigs, parseMeasurement, roundToDecimalPlaces, roundToSigFigs } from '@/lib/chemistry/sig-figs'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

const fmt = (n: number) => String(Number(n.toPrecision(10)))

/** Percent error = |experimental − accepted| / |accepted| × 100 (signed keeps the direction). */
export function percentError(i: {
  experimental: number
  accepted: number
  signed?: boolean
  sigFigs?: number
}): Result<{ value: number; display: string; absoluteError: number; steps: Step[] }> {
  if (!Number.isFinite(i.experimental) || !Number.isFinite(i.accepted)) return fail('Enter both values as numbers.')
  if (i.accepted === 0) {
    return fail('Percent error is undefined when the accepted value is 0. Compare the two values with percent difference instead.')
  }
  const diff = i.experimental - i.accepted
  const absoluteError = Math.abs(diff)
  const value = ((i.signed ? diff : absoluteError) / Math.abs(i.accepted)) * 100
  const display = `${i.sigFigs ? roundToSigFigs(value, i.sigFigs).fixed : fmt(Number(value.toPrecision(4)))}%`

  const steps: Step[] = [
    {
      label: i.signed ? 'Subtract' : 'Absolute error',
      detail: i.signed
        ? `${fmt(i.experimental)} − ${fmt(i.accepted)} = ${fmt(diff)}`
        : `|${fmt(i.experimental)} − ${fmt(i.accepted)}| = ${fmt(absoluteError)}`,
    },
    { label: 'Divide by the accepted value', detail: `${fmt(i.signed ? diff : absoluteError)} ÷ ${fmt(Math.abs(i.accepted))} = ${fmt(value / 100)}` },
    { label: 'Multiply by 100', detail: `${fmt(value / 100)} × 100 = ${fmt(value)}%` },
  ]
  if (i.sigFigs) steps.push({ label: 'Round', detail: `${fmt(value)}% → ${display} (${i.sigFigs} significant figures)` })
  return ok({ value, display, absoluteError, steps })
}

/**
 * Sig figs for "Auto" rounding. Percent error subtracts first, so the difference is
 * limited to the least precise decimal place of the two inputs (subtraction rule);
 * dividing by the accepted value then keeps the fewer sig figs of the difference
 * and the accepted value (division rule). The × 100 is exact.
 */
export function autoSigFigs(experimental: string, accepted: string): Result<{ n: number; steps: Step[] }> {
  const ce = countSigFigs(experimental)
  if (!ce.ok) return fail(`Experimental value: ${ce.error}`)
  const ca = countSigFigs(accepted)
  if (!ca.ok) return fail(`Accepted value: ${ca.error}`)
  const dp = Math.min(ce.value.decimalPlaces, ca.value.decimalPlaces)
  const diff = Math.abs(parseMeasurement(experimental)! - parseMeasurement(accepted)!)
  // The difference counted in units of its last significant place, e.g. 2.3 at 1 dp → 23.
  const units = Math.round(diff * 10 ** dp)
  const diffCount = units === 0 ? 1 : String(units).length
  const n = Math.min(diffCount, ca.value.count)
  const rounded = units === 0 ? '0' : roundToDecimalPlaces(diff, dp)
  return ok({
    n,
    steps: [
      {
        label: 'Sig figs of the difference',
        detail: `Subtraction keeps the less precise place, so the difference is ${rounded} (${diffCount} sig fig${diffCount === 1 ? '' : 's'}).`,
      },
      {
        label: 'Sig figs of the answer',
        detail: `Division keeps the fewer of ${diffCount} (difference) and ${ca.value.count} (accepted value) → ${n}.`,
      },
    ],
  })
}
