import type { College } from '@/lib/data/schema'

const fmt = (n: number) => n.toString()

/** A 2–3 sentence intro built from the college's own data, so no two college pages read alike. */
export function collegeIntro(college: College): string {
  const { shortName, scale, honors, nonGpaGrades } = college
  const sentences: string[] = []

  const aPlus = scale.find((r) => r.letter.toUpperCase() === 'A+')
  const top = Math.max(...scale.map((r) => r.points))
  sentences.push(
    aPlus
      ? `${shortName} grades on a ${fmt(top)}-point scale, and an A+ is worth ${fmt(aPlus.points)}${aPlus.points === 4 ? ', the same as an A' : ''}.`
      : `${shortName} grades on a ${fmt(top)}-point scale with no A+ grade.`,
  )

  const lowest = Math.min(
    ...honors.schools.flatMap((s) => [s.cumLaude, s.magnaCumLaude, s.summaCumLaude].filter((n): n is number => n !== undefined)),
  )
  const who =
    honors.schools.length === 1
      ? 'one set of cutoffs for all undergraduates'
      : `separate cutoffs for ${honors.schools.length} schools`
  sentences.push(
    honors.basis === 'percentile'
      ? `Latin honors are set each year by class rank, with ${who}; the ${honors.academicYear} cutoffs start at a ${fmt(lowest)} GPA.`
      : `Latin honors use fixed GPA cutoffs, with ${who}, starting at ${fmt(lowest)}.`,
  )

  if (nonGpaGrades.length > 0) {
    const list = nonGpaGrades.slice(0, 3).join(', ')
    sentences.push(`Grades such as ${list} don't count toward the GPA.`)
  }
  return sentences.join(' ')
}
