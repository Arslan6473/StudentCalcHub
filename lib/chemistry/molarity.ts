import { gramsToMoles, molarMass } from '@/lib/chemistry/formula'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

const fmt = (n: number) => String(Number(n.toPrecision(6)))

/** Molarity (mol/L) from moles, or from grams of a formula, and a volume in liters. */
export function molarity(i: { moles?: number; grams?: number; formula?: string; volumeL: number }): Result<{ molarity: number; steps: Step[] }> {
  if (!Number.isFinite(i.volumeL) || i.volumeL <= 0) return fail('Volume must be greater than 0.')
  const steps: Step[] = []
  let moles: number

  if (i.moles !== undefined) {
    if (!Number.isFinite(i.moles) || i.moles < 0) return fail('Moles must be 0 or more.')
    moles = i.moles
  } else if (i.grams !== undefined && i.formula) {
    const mm = molarMass(i.formula)
    if (!mm.ok) return mm
    const conv = gramsToMoles(i.grams, mm.value.value)
    if (!conv.ok) return conv
    moles = conv.value.moles
    steps.push({ label: 'Molar mass', detail: `${i.formula.replace(/\s+/g, '')} = ${fmt(mm.value.value)} g/mol` }, conv.value.steps[0])
  } else {
    return fail('Enter the moles of solute, or its mass and formula.')
  }

  const value = moles / i.volumeL
  steps.push({ label: 'Divide by volume', detail: `${fmt(moles)} mol ÷ ${fmt(i.volumeL)} L = ${fmt(value)} mol/L` })
  return ok({ molarity: value, steps })
}

type DilutionKey = 'c1' | 'v1' | 'c2' | 'v2'

/** M1V1 = M2V2 — give exactly three values (any consistent units) and get the fourth. */
export function solveDilution(i: Partial<Record<DilutionKey, number>>): Result<{
  solvedFor: DilutionKey
  value: number
  warning?: string
  steps: Step[]
}> {
  const keys: DilutionKey[] = ['c1', 'v1', 'c2', 'v2']
  const missing = keys.filter((k) => i[k] === undefined)
  if (missing.length !== 1) return fail('Fill in exactly three of the four values and leave one blank.')
  for (const k of keys) {
    const v = i[k]
    if (v !== undefined && (!Number.isFinite(v) || v <= 0)) return fail('Concentrations and volumes must be greater than 0.')
  }

  const solvedFor = missing[0]
  const { c1, v1, c2, v2 } = i as Record<DilutionKey, number>
  const value =
    solvedFor === 'c1' ? (c2 * v2) / v1 : solvedFor === 'v1' ? (c2 * v2) / c1 : solvedFor === 'c2' ? (c1 * v1) / v2 : (c1 * v1) / c2
  const all = { c1, v1, c2, v2, [solvedFor]: value } as Record<DilutionKey, number>
  const name = { c1: 'M₁', v1: 'V₁', c2: 'M₂', v2: 'V₂' }
  const [a, b] = solvedFor.endsWith('1') ? (['c2', 'v2'] as const) : (['c1', 'v1'] as const)
  const divisor = keys.find((k) => k !== solvedFor && k !== a && k !== b)!

  const steps: Step[] = [
    { label: 'Rearrange', detail: `${name[solvedFor]} = ${name[a]} × ${name[b]} ÷ ${name[divisor]}` },
    { label: 'Substitute', detail: `${fmt(all[a])} × ${fmt(all[b])} ÷ ${fmt(all[divisor])} = ${fmt(value)}` },
  ]
  const warning =
    all.c2 > all.c1
      ? 'The final concentration is higher than the starting one, so this is not a dilution. Check which values are before (1) and after (2).'
      : undefined
  return ok({ solvedFor, value, warning, steps })
}
