import { z } from 'zod'

import raw from '@/data/test-prep/nmsqt-cutoffs.json'
import { SourceSchema } from '@/lib/data/schema'

const selectionIndex = z.number().int().min(48).max(228)

export const NmsqtCutoffSchema = z.object({
  classOf: z.string().regex(/^\d{4}$/),
  testYear: z.string().regex(/^\d{4}$/),
  commended: selectionIndex,
  lastChecked: z.iso.date(),
  note: z.string().min(1),
  sources: z.array(SourceSchema).min(1),
  cutoffs: z.array(z.object({ state: z.string().min(1), index: selectionIndex })).min(1),
})

export type NmsqtCutoffs = z.infer<typeof NmsqtCutoffSchema>

/** Past National Merit Semifinalist cutoffs, validated at import so bad data fails the build. */
export const NMSQT: NmsqtCutoffs = NmsqtCutoffSchema.parse(raw)
