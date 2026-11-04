import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'
import { letterToPoints, normalizeGrade } from '@/lib/gpa/scale'

export interface TermGpa {
  gpa: number
  totalPoints: number
  totalUnits: number
  /** Grades left out of the average (P/NP, W, …), in the order entered. */
  excluded: string[]
  steps: Step[]
}

const fmt = (n: number) => Number(n.toFixed(4)).toString()

/** Units-weighted GPA: Σ(points × units) ÷ Σ units over graded courses only. */
export function termGpa(
  courses: { grade: string; units: number }[],
  scale: { letter: string; points: number }[],
  nonGpaGrades: string[],
): Result<TermGpa> {
  const nonGpa = new Set(nonGpaGrades.map(normalizeGrade))
  const steps: Step[] = []
  const excluded: string[] = []
  let totalPoints = 0
  let totalUnits = 0

  for (const course of courses) {
    const grade = normalizeGrade(course.grade)
    if (!(course.units > 0)) return fail(`Units must be more than 0 (check the ${grade || 'blank'} course).`)
    if (nonGpa.has(grade)) {
      excluded.push(grade)
      continue
    }
    const points = letterToPoints(grade, scale)
    if (points === null) return fail(`“${grade}” isn’t a grade on this scale.`)
    const product = points * course.units
    totalPoints += product
    totalUnits += course.units
    steps.push({ label: `${grade} × ${fmt(course.units)} units`, detail: `${fmt(points)} × ${fmt(course.units)} = ${fmt(product)} grade points` })
  }

  if (totalUnits === 0) return fail('Add at least one letter-graded course — P/NP-type grades don’t count toward GPA.')

  const gpa = totalPoints / totalUnits
  if (excluded.length > 0) steps.push({ label: 'Left out', detail: `${excluded.join(', ')} — not counted in GPA` })
  steps.push({ label: 'Total', detail: `${fmt(totalPoints)} grade points ÷ ${fmt(totalUnits)} units` })
  steps.push({ label: 'GPA', detail: `${fmt(totalPoints)} ÷ ${fmt(totalUnits)} = ${gpa} → ${gpa.toFixed(2)}` })
  return ok({ gpa, totalPoints, totalUnits, excluded, steps })
}
