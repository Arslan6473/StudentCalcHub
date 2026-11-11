import { parseNumberInput } from '@/lib/input'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

export type ScaleId = 'us4' | 'five' | 'au7' | 'ten' | 'fr20' | 'percent' | 'custom'
export type TargetId = ScaleId | 'german'

export interface GradeScale {
  id: ScaleId
  label: string
  /** Short unit for steps and results, e.g. 'out of 4.0'. */
  unit: string
  min: number
  max: number
  /** Lowest passing grade, only where an official source states it. Used as the German-conversion default. */
  pass?: number
  decimals: number
}

/**
 * Built-in scales, all read as 0 up to the maximum so the linear conversion is a plain proportion.
 * Pass marks: UQ final grades (4 = Pass on the 1–7 scale), Université de Lorraine (10/20 to validate credits).
 */
export const SCALES: GradeScale[] = [
  { id: 'us4', label: 'US GPA (4.0 scale)', unit: 'out of 4.0', min: 0, max: 4, decimals: 2 },
  { id: 'five', label: '5.0 GPA scale', unit: 'out of 5.0', min: 0, max: 5, decimals: 2 },
  {
    id: 'au7',
    label: 'Australian GPA (7-point)',
    unit: 'out of 7',
    min: 0,
    max: 7,
    pass: 4,
    decimals: 2,
  },
  {
    id: 'ten',
    label: '10-point CGPA (India, Pakistan)',
    unit: 'out of 10',
    min: 0,
    max: 10,
    decimals: 2,
  },
  {
    id: 'fr20',
    label: 'French scale (0–20)',
    unit: 'out of 20',
    min: 0,
    max: 20,
    pass: 10,
    decimals: 2,
  },
  { id: 'percent', label: 'Percentage (0–100)', unit: '%', min: 0, max: 100, decimals: 1 },
  { id: 'custom', label: 'Custom scale', unit: 'custom', min: 0, max: 0, decimals: 2 },
]

export const GERMAN_LABEL = 'German grade (1.0 best, 4.0 pass)'

export interface ScaleConversion {
  /** Unrounded linear result, or the truncated German grade. */
  value: number
  display: string
  targetLabel: string
  method: 'linear' | 'bavarian'
  /** German only: the grade is below the source scale's pass mark, so it is a fail in Germany. */
  failing: boolean
  steps: Step[]
}

export interface ScaleInput {
  value: string
  from: ScaleId
  to: TargetId
  /** Bounds for the 'custom' scale, as typed. */
  custom?: { min: string; max: string }
  /** Lowest passing grade on the source scale, as typed. Needed for the German conversion. */
  passing?: string
}

/** Trims float noise for the working: 2.8000000000000003 → '2.8'. */
function fmt(n: number): string {
  return Number(n.toFixed(4)).toString()
}

function parseField(label: string, raw: string): Result<number> {
  const p = parseNumberInput(raw)
  return p.ok ? p : fail(`${label}: ${p.error}`)
}

/** Straight-line map from [fromMin, fromMax] to [toMin, toMax]. */
export function linearConvert(
  value: number,
  from: { min: number; max: number },
  to: { min: number; max: number }
): number {
  return to.min + ((value - from.min) / (from.max - from.min)) * (to.max - to.min)
}

/**
 * Modified Bavarian formula (KMK, 15.03.1991 i. d. F. 12.09.2013): x = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin).
 * Unrounded; see truncateOneDecimal for the KMK's "one decimal, not rounded" rule.
 */
export function germanGrade(nd: number, nmax: number, nmin: number): number {
  return 1 + (3 * (nmax - nd)) / (nmax - nmin)
}

/** Cuts to one decimal without rounding: 1.75 → 1.7. The epsilon stops 2.0 arriving as 1.9999… → 1.9. */
export function truncateOneDecimal(n: number): number {
  return Math.floor(n * 10 + 1e-9) / 10
}

function resolveScale(id: ScaleId, custom: ScaleInput['custom']): Result<GradeScale> {
  const scale = SCALES.find((s) => s.id === id)
  if (!scale) return fail('Choose a grading scale.')
  if (id !== 'custom') return ok(scale)
  const min = parseField('Custom scale lowest grade', custom?.min ?? '')
  if (!min.ok) return min
  const max = parseField('Custom scale highest grade', custom?.max ?? '')
  if (!max.ok) return max
  if (min.value >= max.value)
    return fail('The custom scale’s highest grade must be above its lowest grade.')
  return ok({
    ...scale,
    min: min.value,
    max: max.value,
    unit: `on ${fmt(min.value)}–${fmt(max.value)}`,
  })
}

export function convertScale(input: ScaleInput): Result<ScaleConversion> {
  const source = resolveScale(input.from, input.custom)
  if (!source.ok) return source
  const from = source.value

  const parsed = parseField('Your grade', input.value)
  if (!parsed.ok) return parsed
  const v = parsed.value
  if (v < from.min || v > from.max) {
    return fail(
      `Your grade must be between ${fmt(from.min)} and ${fmt(from.max)} on the ${from.label.toLowerCase()}.`
    )
  }

  if (input.to === 'german') return toGerman(v, from, input.passing ?? '')

  const target = resolveScale(input.to, input.custom)
  if (!target.ok) return target
  const to = target.value
  const value = linearConvert(v, from, to)
  const zeroBased = from.min === 0 && to.min === 0
  const steps: Step[] = zeroBased
    ? [
        {
          label: 'Share of the scale',
          detail: `${fmt(v)} ÷ ${fmt(from.max)} = ${fmt(v / from.max)}`,
        },
        { label: 'Scale up', detail: `${fmt(v / from.max)} × ${fmt(to.max)} = ${fmt(value)}` },
      ]
    : [
        {
          label: 'Share of the scale',
          detail: `(${fmt(v)} − ${fmt(from.min)}) ÷ (${fmt(from.max)} − ${fmt(from.min)}) = ${fmt((v - from.min) / (from.max - from.min))}`,
        },
        {
          label: 'Map onto the new scale',
          detail: `${fmt(to.min)} + ${fmt((v - from.min) / (from.max - from.min))} × (${fmt(to.max)} − ${fmt(to.min)}) = ${fmt(value)}`,
        },
      ]
  const rounded = value.toFixed(to.decimals)
  steps.push({ label: 'Round', detail: to.unit === '%' ? `${rounded}%` : `${rounded} ${to.unit}` })
  return ok({
    value,
    display: value.toFixed(to.decimals),
    targetLabel: to.label,
    method: 'linear',
    failing: false,
    steps,
  })
}

function toGerman(nd: number, from: GradeScale, rawPass: string): Result<ScaleConversion> {
  const pass = parseField('Lowest passing grade', rawPass)
  if (!pass.ok) return pass
  const nmin = pass.value
  const nmax = from.max
  if (nmin < from.min || nmin >= nmax) {
    return fail(
      `The lowest passing grade must be at least ${fmt(from.min)} and below the top grade (${fmt(nmax)}).`
    )
  }

  const raw = germanGrade(nd, nmax, nmin)
  const steps: Step[] = [
    { label: 'Formula', detail: 'German grade = 1 + 3 × (Nmax − Nd) ÷ (Nmax − Nmin)' },
    {
      label: 'Plug in',
      detail: `1 + 3 × (${fmt(nmax)} − ${fmt(nd)}) ÷ (${fmt(nmax)} − ${fmt(nmin)}) = ${fmt(raw)}`,
    },
  ]

  if (nd < nmin) {
    steps.push({
      label: 'Below the pass mark',
      detail: `${fmt(nd)} is below ${fmt(nmin)}, so the result is worse than 4.0 — a fail in German grading`,
    })
    return ok({
      value: raw,
      display: 'Fail',
      targetLabel: GERMAN_LABEL,
      method: 'bavarian',
      failing: true,
      steps,
    })
  }

  const grade = truncateOneDecimal(raw)
  steps.push({
    label: 'Cut to one decimal',
    detail: `${fmt(raw)} → ${grade.toFixed(1)} (cut off, not rounded)`,
  })
  return ok({
    value: grade,
    display: grade.toFixed(1),
    targetLabel: GERMAN_LABEL,
    method: 'bavarian',
    failing: false,
    steps,
  })
}
