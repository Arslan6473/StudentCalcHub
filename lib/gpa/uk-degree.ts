import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

export interface UkModule {
  credits: number
  /** Module mark as a percentage, 0–100. */
  mark: number
  name?: string
}

export interface UkYear {
  label: string
  /** Relative weighting, e.g. 1 and 2 for a 1 : 2 split. Only the ratio matters. */
  weight: number
  modules: UkModule[]
}

export interface UkClass {
  name: string
  short: string
  /** Lowest average in the band. */
  min: number
}

/**
 * The typical bachelor's honours boundaries (UKSCQA principles: first ≥70,
 * 2:1 60–69, 2:2 50–59, third 40–49). Highest first.
 */
export const UK_CLASSES: UkClass[] = [
  { name: 'First-class honours', short: 'First', min: 70 },
  { name: 'Upper second-class honours', short: '2:1', min: 60 },
  { name: 'Lower second-class honours', short: '2:2', min: 50 },
  { name: 'Third-class honours', short: 'Third', min: 40 },
  { name: 'Below honours (fail)', short: 'Fail', min: 0 },
]

/**
 * How far below a boundary we flag a result as borderline. Universities set
 * their own zone (1.5 or 2 marks are published examples), so this is only a prompt to check.
 */
export const BORDERLINE_MARGIN = 2

export interface UkYearAverage {
  label: string
  average: number
  credits: number
  /** Share of the final mark, 0–1. */
  share: number
}

export interface UkDegreeResult {
  years: UkYearAverage[]
  overall: number
  classification: UkClass
  /** The class above, when the average is within BORDERLINE_MARGIN of it. */
  borderline: { next: UkClass; gap: number } | null
  steps: Step[]
}

const fmt = (n: number) => Number(n.toFixed(2)).toString()

/** The class whose band contains the average (no rounding — rules on 69.5 vary). */
export function classify(average: number): UkClass {
  return UK_CLASSES.find((c) => average >= c.min) ?? UK_CLASSES[UK_CLASSES.length - 1]
}

function bandDetail(average: number, c: UkClass): string {
  const i = UK_CLASSES.indexOf(c)
  if (i === 0) return `${fmt(average)} is ${c.min} or more → ${c.name}`
  const next = UK_CLASSES[i - 1].min
  if (c.min === 0) return `${fmt(average)} is below ${next} → ${c.name}`
  return `${fmt(average)} is at least ${c.min} and below ${next} → ${c.name} (${c.short})`
}

/**
 * Credit-weighted average for each year, then a weighted average of the years.
 * Years with weighting 0 are shown but don't count.
 */
export function ukDegreeClassification(years: UkYear[]): Result<UkDegreeResult> {
  if (years.length === 0) return fail('Add at least one year.')
  for (const year of years) {
    if (!Number.isFinite(year.weight) || year.weight < 0)
      return fail(`${year.label}: the weighting can’t be negative.`)
  }
  const totalWeight = years.reduce((sum, y) => sum + y.weight, 0)
  if (totalWeight === 0) return fail('At least one year needs a weighting above 0.')

  const steps: Step[] = []
  const averages: UkYearAverage[] = []

  for (const year of years) {
    if (year.modules.length === 0) {
      if (year.weight > 0)
        return fail(`${year.label}: add at least one module, or set its weighting to 0.`)
      continue
    }
    let credits = 0
    let points = 0
    for (const [i, m] of year.modules.entries()) {
      const which = `${year.label}, ${m.name?.trim() || `module ${i + 1}`}`
      if (!(m.credits > 0)) return fail(`${which}: credits must be more than 0.`)
      if (!(m.mark >= 0 && m.mark <= 100))
        return fail(`${which}: the mark must be between 0 and 100.`)
      credits += m.credits
      points += m.credits * m.mark
    }
    const average = points / credits
    averages.push({ label: year.label, average, credits, share: year.weight / totalWeight })
    steps.push({
      label: `${year.label} average`,
      detail: `Σ(credits × mark) = ${fmt(points)}; ${fmt(points)} ÷ ${fmt(credits)} credits = ${fmt(average)}`,
    })
  }

  const counted = averages.filter((a) => a.share > 0)
  steps.push({
    label: 'Weighting',
    detail: `${years.map((y) => fmt(y.weight)).join(' : ')} → ${counted.map((a) => `${a.label} ${fmt(a.share * 100)}%`).join(', ')}`,
  })

  const overall = counted.reduce((sum, a) => sum + a.average * a.share, 0)
  steps.push({
    label: 'Overall average',
    detail: `${counted.map((a) => `${fmt(a.average)} × ${Number(a.share.toFixed(4))}`).join(' + ')} = ${fmt(overall)}`,
  })

  const classification = classify(overall)
  steps.push({ label: 'Classification', detail: bandDetail(overall, classification) })

  const i = UK_CLASSES.indexOf(classification)
  const next = i > 0 ? UK_CLASSES[i - 1] : null
  const gap = next ? next.min - overall : Infinity
  const borderline = next && gap <= BORDERLINE_MARGIN ? { next, gap } : null
  if (borderline) {
    steps.push({
      label: 'Borderline',
      detail: `${fmt(gap)} below the ${borderline.next.short} boundary of ${borderline.next.min} — check your university’s borderline rules`,
    })
  }

  return ok({ years: averages, overall, classification, borderline, steps })
}
