import { describe, expect, it } from 'vitest'
import { adsTxt } from '@/config/ads'

describe('adsTxt', () => {
  it('returns null when no AdSense client is configured', () => {
    expect(adsTxt(undefined)).toBeNull()
  })

  it('builds the Google seller line from a ca-pub client id', () => {
    expect(adsTxt('ca-pub-123')).toBe('google.com, pub-123, DIRECT, f08c47fec0942fa0\n')
  })
})
