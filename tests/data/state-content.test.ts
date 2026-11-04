import { describe, expect, it } from 'vitest'

import { electiveCredits, stateFaqs, stateIntro } from '@/lib/data/state-content'
import type { State } from '@/lib/data/schema'
import fixture from './fixtures/state-valid.json'

const state = fixture as State
const twoPlans: State = {
  ...state,
  plans: [
    state.plans[0],
    { name: 'Advanced diploma', totalCredits: 26, subjects: [...state.plans[0].subjects, { key: 'world-language', label: 'World language', credits: 2 }] },
  ],
  otherRequirements: ['Pass the state civics test'],
}

describe('electiveCredits', () => {
  it('is the total minus the named subject credits', () => {
    expect(electiveCredits(state.plans[0])).toBe(13)
  })
  it('never goes below zero and handles half credits', () => {
    expect(electiveCredits({ totalCredits: 4, subjects: [{ key: 'a', label: 'A', credits: 2.5 }, { key: 'b', label: 'B', credits: 1.5 }] })).toBe(0)
    expect(electiveCredits({ totalCredits: 22, subjects: [{ key: 'a', label: 'A', credits: 0.5 }] })).toBe(21.5)
  })
})

describe('stateIntro', () => {
  it('answers with the credit total in the first sentence', () => {
    expect(stateIntro(state).split('. ')[0]).toMatch(/Example State.*24 credits/)
  })
  it('names the range across plans when there are several', () => {
    expect(stateIntro(twoPlans)).toMatch(/24 to 26 credits/)
    expect(stateIntro(twoPlans)).toMatch(/Advanced diploma/)
  })
})

describe('stateFaqs', () => {
  it('gives at least 4 questions, each ending in "?"', () => {
    for (const s of [state, twoPlans]) {
      const faqs = stateFaqs(s)
      expect(faqs.length).toBeGreaterThanOrEqual(4)
      for (const f of faqs) expect(f.question.endsWith('?')).toBe(true)
    }
  })
  it('uses the state data in its answers', () => {
    const text = stateFaqs(twoPlans).map((f) => f.answer).join(' ')
    expect(text).toMatch(/4 credits of English/)
    expect(text).toMatch(/civics test/)
  })
})
