import { describe, expect, it } from 'vitest'

import { getState, getStates } from '@/lib/data/states'

const states = getStates()
const today = '2026-11-04'

describe('state data', () => {
  // Plan asked for ≥ 8; 7 could be verified from reachable official sources (see ledger, Task 8).
  it('has at least 7 states', () => {
    expect(states.length).toBeGreaterThanOrEqual(7)
  })

  it('has unique abbreviations and slugs', () => {
    expect(new Set(states.map((s) => s.abbr)).size).toBe(states.length)
    expect(new Set(states.map((s) => s.slug)).size).toBe(states.length)
  })

  it('uses full-name slugs', () => {
    for (const s of states) expect(s.slug).toBe(s.name.toLowerCase().replace(/\s+/g, '-'))
  })

  it('keeps every plan total between 13 and 30 credits', () => {
    for (const s of states)
      for (const p of s.plans) {
        expect(p.totalCredits, `${s.slug} / ${p.name}`).toBeGreaterThanOrEqual(13)
        expect(p.totalCredits, `${s.slug} / ${p.name}`).toBeLessThanOrEqual(30)
      }
  })

  it('has unique subject keys within each plan and no "electives" subject', () => {
    for (const s of states)
      for (const p of s.plans) {
        const keys = p.subjects.map((x) => x.key)
        expect(new Set(keys).size, `${s.slug} / ${p.name}`).toBe(keys.length)
        expect(keys).not.toContain('electives')
      }
  })

  it('states the cohort as a short "YYYY and later" class label (used in the H1)', () => {
    for (const s of states) expect(s.appliesToClassOf, s.slug).toMatch(/^20\d\d and later$/)
  })

  it('was checked no later than today', () => {
    for (const s of states) expect(s.lastChecked <= today, s.slug).toBe(true)
  })

  it('is sorted by name and looks up by slug', () => {
    expect(states.map((s) => s.name)).toEqual([...states.map((s) => s.name)].sort((a, b) => a.localeCompare(b)))
    expect(getState(states[0].slug)).toBe(states[0])
    expect(getState('nowhere')).toBeUndefined()
  })
})

describe('North Carolina cohorts', () => {
  // Current high schoolers (classes of 2027–2029) don't need the computer science credit.
  it('offers a plan for current students without the computer science credit', () => {
    const nc = getState('north-carolina')!
    expect(nc.appliesToClassOf).toBe('2027 and later')
    const current = nc.plans.find((p) => p.name.includes('2027'))
    expect(current?.subjects.some((s) => s.key === 'computer-science')).toBe(false)
    expect(current?.totalCredits).toBe(22)
    const future = nc.plans.find((p) => p.name.includes('2030'))
    expect(future?.subjects.some((s) => s.key === 'computer-science')).toBe(true)
  })
})
