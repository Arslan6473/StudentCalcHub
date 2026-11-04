import { ATOMIC_MASSES, AVOGADRO, NO_STANDARD_WEIGHT } from '@/lib/chemistry/elements'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

type Counts = Record<string, number>

const CLOSER = { '(': ')', '[': ']' } as const
const fmt = (n: number, digits = 6) => String(Number(n.toPrecision(digits)))

class FormulaError extends Error {}

function add(into: Counts, from: Counts, times: number) {
  for (const [el, n] of Object.entries(from)) into[el] = (into[el] ?? 0) + n * times
}

/** Recursive descent over one hydrate part: elements, numbers, () and [] groups. */
function parsePart(src: string): Counts {
  let i = 0

  const readNumber = (): number => {
    const m = /^\d+/.exec(src.slice(i))
    if (!m) return 1
    i += m[0].length
    const n = Number(m[0])
    if (n === 0) throw new FormulaError('A count of 0 isn’t allowed — leave out an element that isn’t there.')
    return n
  }

  const group = (closer: ')' | ']' | null): Counts => {
    const counts: Counts = {}
    while (i < src.length) {
      const ch = src[i]
      if (ch === '(' || ch === '[') {
        i++
        const inner = group(CLOSER[ch])
        add(counts, inner, readNumber())
      } else if (ch === ')' || ch === ']') {
        if (closer === null) throw new FormulaError(`There’s a closing ${ch === ')' ? 'parenthesis' : 'bracket'} with no opening one.`)
        if (ch !== closer) throw new FormulaError(`Mismatched brackets and parentheses: expected “${closer}” but found “${ch}”.`)
        i++
        return counts
      } else if (/[A-Z]/.test(ch)) {
        const sym = /^[A-Z][a-z]?/.exec(src.slice(i))![0]
        i += sym.length
        if (!(sym in ATOMIC_MASSES) && !NO_STANDARD_WEIGHT.has(sym)) throw new FormulaError(`“${sym}” isn’t an element symbol.`)
        counts[sym] = (counts[sym] ?? 0) + readNumber()
      } else if (/[a-z]/.test(ch)) {
        throw new FormulaError(`“${ch}” — element symbols start with a capital letter (Na, Cl, Co).`)
      } else if (/\d/.test(ch)) {
        throw new FormulaError('A number has to follow an element or a group, like H2 or (OH)2.')
      } else {
        throw new FormulaError(`“${ch}” can’t appear in a chemical formula.`)
      }
    }
    if (closer) throw new FormulaError(`Missing a closing ${closer === ')' ? 'parenthesis' : 'bracket'} “${closer}”.`)
    return counts
  }

  return group(null)
}

/** Atom counts for a formula like Ca(OH)2, K4[Fe(CN)6] or CuSO4·5H2O. */
export function parseFormula(formula: string): Result<Counts> {
  const src = formula.replace(/\s+/g, '')
  if (src === '') return fail('Enter a chemical formula, like H2O or Ca(OH)2.')
  try {
    const counts: Counts = {}
    for (const part of src.split(/[·•*.]/)) {
      if (part === '') throw new FormulaError('There’s an empty part around a hydrate dot — write it like CuSO4·5H2O.')
      const coefficient = /^\d+/.exec(part)?.[0]
      const body = coefficient ? part.slice(coefficient.length) : part
      if (body === '') throw new FormulaError('A hydrate coefficient needs a formula after it, like 5H2O.')
      if (coefficient && Number(coefficient) === 0) throw new FormulaError('A coefficient of 0 isn’t allowed.')
      add(counts, parsePart(body), coefficient ? Number(coefficient) : 1)
    }
    return ok(counts)
  } catch (e) {
    if (!(e instanceof FormulaError)) throw e
    // "co2" → suggest "CO2" when the capitalized form is a valid formula.
    if (/^[^A-Z]*$/.test(src) && /[a-z]/.test(src)) {
      const upper = parseFormula(src.toUpperCase())
      if (upper.ok) return fail(`Element symbols start with a capital letter — did you mean ${src.toUpperCase()}?`)
    }
    return fail(e.message)
  }
}

export function molarMass(formula: string): Result<{
  value: number
  breakdown: { element: string; count: number; atomicMass: number; subtotal: number }[]
  steps: Step[]
}> {
  const parsed = parseFormula(formula)
  if (!parsed.ok) return parsed
  const missing = Object.keys(parsed.value).find((el) => NO_STANDARD_WEIGHT.has(el))
  if (missing) return fail(`${missing} has no standard atomic weight (it has no stable isotopes), so a molar mass can’t be given.`)

  const breakdown = Object.entries(parsed.value).map(([element, count]) => {
    const atomicMass = ATOMIC_MASSES[element]
    return { element, count, atomicMass, subtotal: count * atomicMass }
  })
  const value = breakdown.reduce((sum, b) => sum + b.subtotal, 0)
  const steps: Step[] = breakdown.map((b) => ({
    label: b.element,
    detail: `${b.count} × ${b.atomicMass} g/mol = ${fmt(b.subtotal)} g/mol`,
  }))
  steps.push({ label: 'Add', detail: `${breakdown.map((b) => fmt(b.subtotal)).join(' + ')} = ${fmt(value)} g/mol` })
  return ok({ value, breakdown, steps })
}

export function gramsToMoles(grams: number, molarMass: number): Result<{ moles: number; particles: number; steps: Step[] }> {
  if (!Number.isFinite(grams) || grams < 0) return fail('Mass must be 0 g or more.')
  if (!Number.isFinite(molarMass) || molarMass <= 0) return fail('Molar mass must be greater than 0 g/mol.')
  const moles = grams / molarMass
  const particles = moles * AVOGADRO
  return ok({
    moles,
    particles,
    steps: [
      { label: 'Divide by molar mass', detail: `${fmt(grams)} g ÷ ${fmt(molarMass)} g/mol = ${fmt(moles)} mol` },
      { label: 'Multiply by Avogadro’s number', detail: `${fmt(moles)} mol × 6.02214076 × 10^23 = ${particles.toExponential(4).replace('e+', ' × 10^')} particles` },
    ],
  })
}

export function molesToGrams(moles: number, molarMass: number): Result<{ grams: number; steps: Step[] }> {
  if (!Number.isFinite(moles) || moles < 0) return fail('Moles must be 0 or more.')
  if (!Number.isFinite(molarMass) || molarMass <= 0) return fail('Molar mass must be greater than 0 g/mol.')
  const grams = moles * molarMass
  return ok({ grams, steps: [{ label: 'Multiply by molar mass', detail: `${fmt(moles)} mol × ${fmt(molarMass)} g/mol = ${fmt(grams)} g` }] })
}
