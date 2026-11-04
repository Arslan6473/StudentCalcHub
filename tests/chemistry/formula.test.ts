import { describe, expect, it } from 'vitest'

import { ATOMIC_MASSES, NO_STANDARD_WEIGHT } from '@/lib/chemistry/elements'
import { gramsToMoles, molarMass, molesToGrams, parseFormula } from '@/lib/chemistry/formula'

function mass(formula: string) {
  const r = molarMass(formula)
  if (!r.ok) throw new Error(r.error)
  return r.value.value
}

function parseError(formula: string) {
  const r = parseFormula(formula)
  expect(r.ok).toBe(false)
  return r.ok ? '' : r.error
}

describe('atomic weight table', () => {
  it('covers every element exactly once between the two lists', () => {
    const symbols = [...Object.keys(ATOMIC_MASSES), ...NO_STANDARD_WEIGHT]
    expect(new Set(symbols).size).toBe(118)
    expect(symbols).toHaveLength(118)
  })
})

describe('molarMass', () => {
  it.each([
    ['H2O', 18.015],
    ['NaCl', 58.44],
    ['Ca(OH)2', 74.09],
    ['CuSO4·5H2O', 249.68],
    ['CuSO4*5H2O', 249.68],
    ['CuSO4.5H2O', 249.68],
    ['C6H12O6', 180.16],
    ['K4[Fe(CN)6]', 368.35],
    [' Ca (OH) 2 ', 74.09],
  ])('%s ≈ %f g/mol', (formula, expected) => {
    expect(mass(formula)).toBeCloseTo(expected, 1)
    expect(Math.abs(mass(formula) - expected)).toBeLessThanOrEqual(0.01)
  })

  it('lists each element once in the breakdown with subtotals that add up', () => {
    const r = molarMass('CuSO4·5H2O')
    if (!r.ok) throw new Error(r.error)
    const o = r.value.breakdown.find((b) => b.element === 'O')
    expect(o?.count).toBe(9)
    const sum = r.value.breakdown.reduce((s, b) => s + b.subtotal, 0)
    expect(sum).toBeCloseTo(r.value.value, 9)
  })
})

describe('parseFormula', () => {
  it('counts atoms through nested groups', () => {
    expect(parseFormula('K4[Fe(CN)6]')).toEqual({ ok: true, value: { K: 4, Fe: 1, C: 6, N: 6 } })
  })

  it('hints at capitals for lowercase input', () => {
    expect(parseError('co2')).toMatch(/capital/)
  })

  it('names an unknown element', () => {
    expect(parseError('Xx2')).toMatch(/Xx/)
  })

  it('explains unbalanced parentheses', () => {
    expect(parseError('Ca(OH')).toMatch(/parenthes/)
    expect(parseError('CaOH)2')).toMatch(/parenthes/)
    expect(parseError('K4[Fe(CN)6)')).toMatch(/bracket|parenthes/)
  })

  it('rejects empty input and stray characters', () => {
    expect(parseFormula('').ok).toBe(false)
    expect(parseFormula('   ').ok).toBe(false)
    expect(parseFormula('H2O!').ok).toBe(false)
    expect(parseFormula('H0').ok).toBe(false)
  })

  it('refuses elements with no standard atomic weight instead of guessing', () => {
    expect(molarMass('TcO2').ok).toBe(false)
    expect(!molarMass('TcO2').ok && (molarMass('TcO2') as { error: string }).error).toMatch(/Tc/)
  })
})

describe('gramsToMoles / molesToGrams', () => {
  it('converts grams to moles and particles', () => {
    const r = gramsToMoles(36.03, 18.015)
    if (!r.ok) throw new Error(r.error)
    expect(r.value.moles).toBeCloseTo(2.0, 3)
    expect(r.value.particles / 1.2044e24).toBeCloseTo(1, 3)
    expect(r.value.steps.length).toBeGreaterThan(0)
  })

  it('rejects a zero or negative molar mass', () => {
    expect(gramsToMoles(10, 0).ok).toBe(false)
    expect(gramsToMoles(10, -5).ok).toBe(false)
  })

  it('rejects negative grams', () => {
    expect(gramsToMoles(-1, 18).ok).toBe(false)
  })

  it('converts moles to grams', () => {
    const r = molesToGrams(0.5, 58.44)
    expect(r.ok && r.value.grams).toBeCloseTo(29.22, 6)
    expect(molesToGrams(1, 0).ok).toBe(false)
  })
})
