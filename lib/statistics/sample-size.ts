import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

/** Two-sided critical z values, keyed by confidence level in percent. */
export const Z_SCORES = { '80': 1.2816, '85': 1.4395, '90': 1.6449, '95': 1.96, '98': 2.3263, '99': 2.5758 } as const

export type Confidence = keyof typeof Z_SCORES

type SampleSize = Result<{ n: number; nInfinite: number; steps: Step[] }>

const fmt = (n: number) => String(Number(n.toPrecision(6)))

/** Finite population correction n = n0 / (1 + (n0 − 1)/N), then round up. */
function finish(n0: number, population: number | undefined, steps: Step[]): SampleSize {
  const nInfinite = Math.ceil(n0)
  if (population === undefined) {
    steps.push({ label: 'Round up', detail: `${fmt(n0)} → ${nInfinite}` })
    return ok({ n: nInfinite, nInfinite, steps })
  }
  const adjusted = n0 / (1 + (n0 - 1) / population)
  const n = Math.min(Math.ceil(adjusted), population)
  steps.push(
    { label: 'Finite population correction', detail: `${fmt(n0)} ÷ (1 + (${fmt(n0)} − 1) ÷ ${population}) = ${fmt(adjusted)}` },
    { label: 'Round up', detail: `${fmt(adjusted)} → ${n}` },
  )
  return ok({ n, nInfinite, steps })
}

function checkPopulation(population?: number): string | null {
  if (population === undefined) return null
  if (!Number.isFinite(population) || population < 1) return 'Population size must be at least 1.'
  return null
}

/** Sample size to estimate a proportion: n0 = z²·p(1−p)/E². */
export function sampleSizeProportion(i: {
  confidence: Confidence
  marginOfError: number
  p?: number
  population?: number
}): SampleSize {
  const p = i.p ?? 0.5
  const E = i.marginOfError
  if (!Number.isFinite(E) || E <= 0 || E >= 1) return fail('Margin of error must be between 0% and 100%.')
  if (!Number.isFinite(p) || p <= 0 || p >= 1) return fail('Expected proportion must be between 0% and 100%.')
  const popError = checkPopulation(i.population)
  if (popError) return fail(popError)

  const z = Z_SCORES[i.confidence]
  const n0 = (z * z * p * (1 - p)) / (E * E)
  return finish(n0, i.population, [
    { label: `z for ${i.confidence}% confidence`, detail: `z = ${z}` },
    { label: 'n₀ = z² · p(1 − p) ÷ E²', detail: `${z}² × ${fmt(p)} × ${fmt(1 - p)} ÷ ${fmt(E)}² = ${fmt(n0)}` },
  ])
}

/** Sample size to estimate a mean: n0 = (z·σ/E)². */
export function sampleSizeMean(i: {
  confidence: Confidence
  marginOfError: number
  sd: number
  population?: number
}): SampleSize {
  const E = i.marginOfError
  if (!Number.isFinite(E) || E <= 0) return fail('Margin of error must be greater than 0.')
  if (!Number.isFinite(i.sd) || i.sd <= 0) return fail('Standard deviation must be greater than 0.')
  const popError = checkPopulation(i.population)
  if (popError) return fail(popError)

  const z = Z_SCORES[i.confidence]
  const n0 = ((z * i.sd) / E) ** 2
  return finish(n0, i.population, [
    { label: `z for ${i.confidence}% confidence`, detail: `z = ${z}` },
    { label: 'n₀ = (z · σ ÷ E)²', detail: `(${z} × ${fmt(i.sd)} ÷ ${fmt(E)})² = ${fmt(n0)}` },
  ])
}
