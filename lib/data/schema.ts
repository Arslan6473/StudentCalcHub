import { z } from 'zod'

/**
 * Schemas for the researched data in data/colleges and data/states. Every
 * record carries its official sources and the date it was last checked
 * against them — a value without a source does not ship.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const isoDate = z.iso.date()

export const SourceSchema = z.object({ label: z.string().min(1), url: z.url() })

const HonorsSchoolSchema = z.object({
  /** 'All undergraduates' when one set of cutoffs applies university-wide. */
  name: z.string().min(1),
  cumLaude: z.number().optional(),
  magnaCumLaude: z.number().optional(),
  summaCumLaude: z.number().optional(),
  extraRequirements: z.array(z.string()).default([]),
})

export const CollegeSchema = z.object({
  slug,
  name: z.string().min(1),
  shortName: z.string().min(1),
  state: z.string().length(2),
  sources: z.array(SourceSchema).min(1),
  lastChecked: isoDate,
  scale: z.array(z.object({ letter: z.string().min(1), points: z.number().min(0).max(4.3) })).min(5),
  scaleNotes: z.array(z.string()),
  nonGpaGrades: z.array(z.string()),
  honors: z
    .object({
      basis: z.enum(['fixed', 'percentile']),
      /** The year a percentile-based cutoff table was published for. */
      academicYear: z.string().optional(),
      rule: z.string().min(20),
      schools: z.array(HonorsSchoolSchema).min(1),
    })
    .refine((h) => h.basis !== 'percentile' || !!h.academicYear, {
      message: 'percentile-based honors need the academicYear of the published cutoffs',
      path: ['academicYear'],
    }),
  deansList: z.string().optional(),
})

const PlanSchema = z
  .object({
    name: z.string().min(1),
    totalCredits: z.number().positive(),
    subjects: z
      .array(
        z.object({
          key: z.string().min(1),
          label: z.string().min(1),
          credits: z.number().nonnegative(),
          notes: z.string().optional(),
        }),
      )
      .min(3),
    notes: z.string().optional(),
  })
  .refine((p) => p.subjects.reduce((sum, s) => sum + s.credits, 0) <= p.totalCredits + 1e-9, {
    message: 'subject credits add up to more than totalCredits',
    path: ['subjects'],
  })

export const StateSchema = z.object({
  slug,
  name: z.string().min(1),
  abbr: z.string().length(2),
  sources: z.array(SourceSchema).min(1),
  lastChecked: isoDate,
  appliesToClassOf: z.string().min(1),
  plans: z.array(PlanSchema).min(1),
  otherRequirements: z.array(z.string()),
  districtNote: z.string().min(20),
})

export type Source = z.infer<typeof SourceSchema>
export type College = z.infer<typeof CollegeSchema>
export type HonorsSchool = College['honors']['schools'][number]
export type State = z.infer<typeof StateSchema>
export type GraduationPlan = State['plans'][number]
