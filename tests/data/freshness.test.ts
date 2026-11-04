import { describe, expect, it } from 'vitest'

import { staleRecords } from '@/lib/data/freshness'

const today = new Date('2026-11-04')

describe('staleRecords', () => {
  it('flags a record last checked over 12 months ago', () => {
    expect(staleRecords([{ slug: 'a', lastChecked: '2025-01-01' }], today)).toEqual(['a'])
  })

  it('passes a record checked within 12 months', () => {
    expect(staleRecords([{ slug: 'a', lastChecked: '2026-06-01' }], today)).toEqual([])
  })
})
