import { describe, expect, it } from 'vitest'

import { NMSQT, NmsqtCutoffSchema } from '@/lib/data/nmsqt'

describe('NMSQT cutoff data', () => {
  it('parses against the schema', () => {
    expect(NmsqtCutoffSchema.safeParse(NMSQT).success).toBe(true)
  })

  it('has unique states with indexes in the Selection Index range', () => {
    const states = NMSQT.cutoffs.map((c) => c.state)
    expect(new Set(states).size).toBe(states.length)
    for (const c of NMSQT.cutoffs) {
      expect(c.index).toBeGreaterThanOrEqual(48)
      expect(c.index).toBeLessThanOrEqual(228)
    }
  })

  it('cites at least one source', () => {
    expect(NMSQT.sources.length).toBeGreaterThan(0)
  })

  it('rejects an index outside 48–228', () => {
    expect(NmsqtCutoffSchema.safeParse({ ...NMSQT, cutoffs: [{ state: 'X', index: 240 }] }).success).toBe(false)
  })
})
