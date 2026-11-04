import { describe, expect, it } from 'vitest'

import { countSigFigs, parseMeasurement, roundToSigFigs, sigFigArithmetic } from '@/lib/chemistry/sig-figs'

function count(input: string) {
  const r = countSigFigs(input)
  if (!r.ok) throw new Error(r.error)
  return r.value
}

describe('countSigFigs', () => {
  it.each([
    ['0.00450', 3],
    ['1500.', 4],
    ['1.500e3', 4],
    ['1.50 x 10^3', 3],
    ['1.50×10^3', 3],
    ['1.50E-3', 3],
    ['100.0', 4],
    ['0', 1],
    ['-0.0820', 3],
    ['+305', 3],
    ['7', 1],
  ])('%s has %i significant figures', (input, n) => {
    expect(count(input).count).toBe(n)
  })

  it('flags trailing zeros without a decimal point as ambiguous', () => {
    expect(count('1500')).toMatchObject({ count: 2, ambiguous: true })
    expect(count('1500.')).toMatchObject({ count: 4, ambiguous: false })
    expect(count('305').ambiguous).toBe(false)
  })

  it('reports the decimal place of the last significant digit', () => {
    expect(count('12.11').decimalPlaces).toBe(2)
    expect(count('1500').decimalPlaces).toBe(-2)
    expect(count('1.50e3').decimalPlaces).toBe(-1)
    expect(count('0.00450').decimalPlaces).toBe(5)
  })

  it('explains its working in steps', () => {
    expect(count('0.00450').steps.length).toBeGreaterThan(0)
  })

  it.each(['', '  ', '1.2.3', 'abc', '.', '1e', '--3', '1,200'])('rejects %j', (input) => {
    expect(countSigFigs(input).ok).toBe(false)
  })
})

describe('parseMeasurement', () => {
  it('reads every supported notation as a number', () => {
    expect(parseMeasurement('1.50 x 10^3')).toBe(1500)
    expect(parseMeasurement('1.50E-3')).toBeCloseTo(0.0015)
    expect(parseMeasurement('-0.0820')).toBeCloseTo(-0.082)
    expect(parseMeasurement('abc')).toBeNull()
  })
})

describe('roundToSigFigs', () => {
  it('keeps trailing zeros', () => {
    expect(roundToSigFigs(2, 3).fixed).toBe('2.00')
  })
  it('rounds large numbers and gives scientific notation', () => {
    expect(roundToSigFigs(1234, 2)).toEqual({ fixed: '1200', scientific: '1.2 × 10^3' })
  })
  it('rounds small numbers', () => {
    expect(roundToSigFigs(0.0045678, 2).fixed).toBe('0.0046')
  })
  it('handles a carry into a new digit', () => {
    expect(roundToSigFigs(9.99, 2)).toEqual({ fixed: '10.', scientific: '1.0 × 10^1' })
  })
  it('marks significant trailing zeros before the decimal point', () => {
    expect(roundToSigFigs(1499.6, 4).fixed).toBe('1500.')
  })
  it('handles negatives and zero', () => {
    expect(roundToSigFigs(-0.012345, 3).fixed).toBe('-0.0123')
    expect(roundToSigFigs(0, 3).fixed).toBe('0.00')
  })
})

describe('sigFigArithmetic', () => {
  it('uses the fewest decimal places for addition', () => {
    const r = sigFigArithmetic('+', '12.11', '0.3')
    expect(r.ok && r.value.rounded).toBe('12.4')
    expect(r.ok && r.value.rule).toMatch(/decimal places/)
  })
  it('uses the fewest decimal places for subtraction', () => {
    const r = sigFigArithmetic('-', '100.0', '0.25')
    expect(r.ok && r.value.rounded).toBe('99.8')
  })
  it('uses the fewest significant figures for multiplication', () => {
    const r = sigFigArithmetic('*', '2.5', '3.47')
    expect(r.ok && r.value.rounded).toBe('8.7')
    expect(r.ok && r.value.rule).toMatch(/significant figures/)
  })
  it('uses the fewest significant figures for division', () => {
    const r = sigFigArithmetic('/', '9.0', '3.000')
    expect(r.ok && r.value.rounded).toBe('3.0')
  })
  it('rejects division by zero and bad input', () => {
    expect(sigFigArithmetic('/', '1.0', '0').ok).toBe(false)
    expect(sigFigArithmetic('+', '1.0', 'x').ok).toBe(false)
  })
})
