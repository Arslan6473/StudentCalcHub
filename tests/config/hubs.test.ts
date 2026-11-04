import { describe, expect, it } from 'vitest'
import { HUBS } from '@/config/hubs'

describe('HUBS', () => {
  it('lists hubs in homepage order, GPA first', () => {
    expect(HUBS.map((h) => h.slug)).toEqual(['gpa', 'chemistry', 'test-prep', 'statistics'])
  })
})
