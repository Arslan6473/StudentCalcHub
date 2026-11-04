import { parseNumberInput } from '@/lib/input'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'
import { letterToPoints, normalizeGrade, percentToLetter, pointsToLetter, STANDARD_SCALE } from '@/lib/gpa/scale'

export interface Conversion {
  letter: string
  points: number
  /** Percentage band for the letter on the standard scale, e.g. '87–89%'. */
  range: string
  steps: Step[]
}

/** The letter's percentage band on the standard scale. */
export function percentRange(letter: string): string {
  const i = STANDARD_SCALE.findIndex((r) => r.letter === letter)
  if (i < 0) return ''
  const row = STANDARD_SCALE[i]
  if (row.minPercent === 0) return `below ${STANDARD_SCALE[i - 1].minPercent}%`
  const top = i === 0 ? 100 : STANDARD_SCALE[i - 1].minPercent - 1
  return `${row.minPercent}–${top}%`
}

function bandDetail(percent: number, letter: string): string {
  const i = STANDARD_SCALE.findIndex((r) => r.letter === letter)
  const min = STANDARD_SCALE[i].minPercent
  if (i === 0) return `${percent}% is ${min}% or more → ${letter}`
  const next = STANDARD_SCALE[i - 1].minPercent
  if (min === 0) return `${percent}% is below ${next}% → ${letter}`
  return `${percent}% is at least ${min}% and below ${next}% → ${letter}`
}

function result(letter: string, steps: Step[]): Conversion {
  const points = letterToPoints(letter) ?? 0
  return { letter, points, range: percentRange(letter), steps }
}

export function convertPercent(raw: string): Result<Conversion> {
  const parsed = parseNumberInput(raw)
  if (!parsed.ok) return parsed
  const percent = parsed.value
  if (percent < 0) return fail('A percentage can’t be below 0.')
  const letter = percentToLetter(percent)
  const steps: Step[] = [
    { label: 'Find the band', detail: bandDetail(percent, letter) },
    { label: 'Look up points', detail: `${letter} = ${(letterToPoints(letter) ?? 0).toFixed(1)} on the 4.0 scale` },
  ]
  if (percent > 100) steps.unshift({ label: 'Over 100%', detail: 'Extra credit still tops out at A+' })
  return ok(result(letter, steps))
}

export function convertLetter(raw: string): Result<Conversion> {
  const letter = normalizeGrade(raw)
  if (letter === '') return fail('Enter a letter grade, like B+.')
  const row = STANDARD_SCALE.find((r) => r.letter === letter)
  if (!row) return fail(`“${letter}” isn’t on the standard scale. Use A+ to F (no E).`)
  return ok(
    result(row.letter, [
      { label: 'Look up points', detail: `${row.letter} = ${row.points.toFixed(1)} on the 4.0 scale` },
      { label: 'Percentage band', detail: `${row.letter} usually covers ${percentRange(row.letter)}` },
    ]),
  )
}

export function convertGpa(raw: string): Result<Conversion> {
  const parsed = parseNumberInput(raw)
  if (!parsed.ok) return parsed
  const gpa = parsed.value
  if (gpa < 0) return fail('A GPA can’t be below 0.')
  if (gpa > 4) return fail('Unweighted GPAs stop at 4.0. Above that is a weighted GPA (honors/AP bonus), which doesn’t map to one letter.')
  const letter = pointsToLetter(gpa)
  return ok(
    result(letter, [
      { label: 'Find the letter', detail: `${gpa} is at or above ${letter} (${(letterToPoints(letter) ?? 0).toFixed(1)}) and below the next grade up` },
      { label: 'Approximate percent', detail: `${letter} usually covers ${percentRange(letter)}` },
    ]),
  )
}
