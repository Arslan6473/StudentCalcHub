import type { CheckerCollege } from '@/components/data/college-honors-checker'
import type { College } from '@/lib/data/schema'

/** Only the fields the client-side checker needs, so pages don't ship whole records. */
export function toCheckerCollege(c: College): CheckerCollege {
  return {
    slug: c.slug,
    shortName: c.shortName,
    basis: c.honors.basis,
    academicYear: c.honors.academicYear,
    schools: c.honors.schools.map(({ name, cumLaude, magnaCumLaude, summaCumLaude }) => ({
      name,
      cumLaude,
      magnaCumLaude,
      summaCumLaude,
    })),
  }
}
