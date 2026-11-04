export type HonorLevel = 'summa cum laude' | 'magna cum laude' | 'cum laude'

/** Highest Latin honor the GPA meets. Cutoffs are inclusive; undefined levels are skipped. */
export function qualifyHonors(
  gpa: number,
  cutoffs: { cumLaude?: number; magnaCumLaude?: number; summaCumLaude?: number },
): HonorLevel | null {
  if (cutoffs.summaCumLaude !== undefined && gpa >= cutoffs.summaCumLaude) return 'summa cum laude'
  if (cutoffs.magnaCumLaude !== undefined && gpa >= cutoffs.magnaCumLaude) return 'magna cum laude'
  if (cutoffs.cumLaude !== undefined && gpa >= cutoffs.cumLaude) return 'cum laude'
  return null
}

const ASCENDING: { level: HonorLevel; key: 'cumLaude' | 'magnaCumLaude' | 'summaCumLaude' }[] = [
  { level: 'cum laude', key: 'cumLaude' },
  { level: 'magna cum laude', key: 'magnaCumLaude' },
  { level: 'summa cum laude', key: 'summaCumLaude' },
]

/** The lowest awarded level the GPA hasn't reached yet, and how far below it the GPA is. */
export function nextHonor(
  gpa: number,
  cutoffs: { cumLaude?: number; magnaCumLaude?: number; summaCumLaude?: number },
): { level: HonorLevel; cutoff: number; gap: number } | null {
  for (const { level, key } of ASCENDING) {
    const cutoff = cutoffs[key]
    if (cutoff !== undefined && gpa < cutoff) return { level, cutoff, gap: cutoff - gpa }
  }
  return null
}
