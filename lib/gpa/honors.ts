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
