import { roundToSigFigs } from '@/lib/chemistry/sig-figs'
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
