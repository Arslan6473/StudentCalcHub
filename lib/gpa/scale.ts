export interface ScaleRow {
  letter: string
  points: number
  /** Lowest percentage for this letter on the common high-school/college band. Schools differ. */
  minPercent: number
}

/** The common unweighted 4.0 scale with +/- and its usual percentage bands. */
export const STANDARD_SCALE: ScaleRow[] = [
  { letter: 'A+', points: 4.0, minPercent: 97 },
  { letter: 'A', points: 4.0, minPercent: 93 },
  { letter: 'A-', points: 3.7, minPercent: 90 },
  { letter: 'B+', points: 3.3, minPercent: 87 },
  { letter: 'B', points: 3.0, minPercent: 83 },
  { letter: 'B-', points: 2.7, minPercent: 80 },
  { letter: 'C+', points: 2.3, minPercent: 77 },
  { letter: 'C', points: 2.0, minPercent: 73 },
  { letter: 'C-', points: 1.7, minPercent: 70 },
  { letter: 'D+', points: 1.3, minPercent: 67 },
  { letter: 'D', points: 1.0, minPercent: 65 },
  { letter: 'F', points: 0, minPercent: 0 },
]

type LetterPoints = { letter: string; points: number }

export function normalizeGrade(grade: string): string {
  return grade.trim().toUpperCase()
}

export function letterToPoints(letter: string, scale: LetterPoints[] = STANDARD_SCALE): number | null {
  const key = normalizeGrade(letter)
  return scale.find((row) => normalizeGrade(row.letter) === key)?.points ?? null
}

export function percentToLetter(percent: number, scale: ScaleRow[] = STANDARD_SCALE): string {
  const row = [...scale].sort((a, b) => b.minPercent - a.minPercent).find((r) => percent >= r.minPercent)
  return (row ?? scale[scale.length - 1]).letter
}

/** Highest letter whose points are at or below the input; on a tie (A+/A = 4.0) the plain letter wins. */
export function pointsToLetter(points: number, scale: LetterPoints[] = STANDARD_SCALE): string {
  const below = scale.filter((row) => row.points <= points + 1e-9)
  if (below.length === 0) return scale[scale.length - 1].letter
  const best = Math.max(...below.map((r) => r.points))
  const tied = below.filter((r) => r.points === best)
  return (tied.find((r) => !r.letter.endsWith('+')) ?? tied[0]).letter
}

/** Grade points as published: 4 → '4.0', 3.67 → '3.67', 3.333 → '3.333'. */
export function formatPoints(points: number): string {
  return Number.isInteger(points) ? points.toFixed(1) : points.toString()
}

/** Dropdown label for a grade: "A- (3.67)", or just "3.7" when the grade is already its own point value. */
export function gradeOptionLabel(letter: string, points: number): string {
  return Number(letter) === points ? letter : `${letter} (${formatPoints(points)})`
}
