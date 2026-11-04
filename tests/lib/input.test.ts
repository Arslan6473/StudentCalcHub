import { describe, expect, it } from 'vitest'
import { parseNumberInput } from '@/lib/input'

describe('parseNumberInput', () => {
  it('rejects an empty string', () => {
    expect(parseNumberInput('').ok).toBe(false)
  })
  it('rejects whitespace only', () => {
    expect(parseNumberInput('   ').ok).toBe(false)
  })
  it('rejects non-numeric text', () => {
    expect(parseNumberInput('abc').ok).toBe(false)
  })
  it('rejects thousands separators with a hint about commas', () => {
    const r = parseNumberInput('1,200')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.toLowerCase()).toContain('comma')
  })
  it('trims and parses decimals', () => {
    expect(parseNumberInput(' 2.5 ')).toEqual({ ok: true, value: 2.5 })
  })
  it('parses negatives', () => {
    expect(parseNumberInput('-3')).toEqual({ ok: true, value: -3 })
  })
  it('parses scientific notation', () => {
    expect(parseNumberInput('1e3')).toEqual({ ok: true, value: 1000 })
  })
  it('rejects Infinity', () => {
    expect(parseNumberInput('Infinity').ok).toBe(false)
  })
  it('rejects partial numbers like "2.5abc"', () => {
    expect(parseNumberInput('2.5abc').ok).toBe(false)
  })
})
