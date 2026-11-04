import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

export interface SigFigCount {
  count: number
  /** Decimal place of the last significant digit: 2 for 12.11, 0 for 1500., -2 for 1500. */
  decimalPlaces: number
  /** True when trailing zeros with no decimal point make the count uncertain (e.g. 1500). */
  ambiguous: boolean
  steps: Step[]
}

interface Parsed {
  sign: string
  intPart: string
  fracPart: string
  hasPoint: boolean
  exponent: number
}

// Mantissa, then optional e-notation or "x 10^n" / "× 10^n".
const PATTERN = /^([+-]?)(\d*)(\.?)(\d*)(?:[eE]([+-]?\d+)|\s*[x×*]\s*10\s*\^\s*([+-]?\d+))?$/

function parse(input: string): Parsed | null {
  const m = PATTERN.exec(input.trim())
  if (!m) return null
  const [, sign, intPart, point, fracPart, e1, e2] = m
  if (intPart === '' && fracPart === '') return null
  return { sign, intPart, fracPart, hasPoint: point === '.', exponent: Number(e1 ?? e2 ?? 0) }
}

/** The numeric value of a measurement written in any notation countSigFigs accepts. */
export function parseMeasurement(input: string): number | null {
  const p = parse(input)
  if (!p) return null
  return Number(`${p.sign}${p.intPart || '0'}.${p.fracPart || '0'}e${p.exponent}`)
}

export function countSigFigs(input: string): Result<SigFigCount> {
  if (input.includes(',')) return fail('Remove commas — type 1200, not 1,200.')
  const p = parse(input)
  if (!p) return fail('Enter a number like 0.00450, 1500, 1.50e3 or 1.50 x 10^3.')

  const digits = p.intPart + p.fracPart
  const steps: Step[] = []
  const first = digits.search(/[1-9]/)

  if (first === -1) {
    const count = Math.max(1, p.fracPart.length)
    steps.push({ label: 'All zeros', detail: 'A measured zero has one significant figure, plus one for each zero after the decimal point.' })
    return ok({ count, decimalPlaces: p.fracPart.length - p.exponent, ambiguous: false, steps })
  }

  if (first > 0) {
    steps.push({ label: 'Leading zeros', detail: `${digits.slice(0, first).length} leading zero(s) only place the decimal point — not significant.` })
  }
  let significant = digits.slice(first)
  let trailingNonSig = 0
  let ambiguous = false

  if (!p.hasPoint) {
    const trimmed = significant.replace(/0+$/, '')
    trailingNonSig = significant.length - trimmed.length
    if (trailingNonSig > 0) {
      ambiguous = true
      significant = trimmed
      steps.push({
        label: 'Trailing zeros, no decimal point',
        detail: `${trailingNonSig} trailing zero(s) are treated as not significant. Write a decimal point or use scientific notation to show they were measured.`,
      })
    }
  } else if (/0$/.test(digits)) {
    steps.push({ label: 'Trailing zeros after a decimal point', detail: 'Zeros at the end with a decimal point are significant.' })
  }

  const inner = significant.slice(1, -1)
  if (inner.includes('0')) {
    steps.push({ label: 'Captive zeros', detail: 'Zeros between nonzero digits are significant.' })
  }
  steps.push({ label: 'Count', detail: `Significant digits: ${significant.split('').join(' ')} → ${significant.length}` })

  const decimalPlaces = (p.hasPoint ? p.fracPart.length : -trailingNonSig) - p.exponent
  return ok({ count: significant.length, decimalPlaces, ambiguous, steps })
}

/** Round to n significant figures, keeping trailing zeros that are significant. */
export function roundToSigFigs(value: number, n: number): { fixed: string; scientific: string } {
  if (value === 0) {
    const zeros = n > 1 ? `0.${'0'.repeat(n - 1)}` : '0'
    return { fixed: zeros, scientific: `${zeros} × 10^0` }
  }
  const [mantissa, expText] = Math.abs(value).toExponential(n - 1).split('e')
  const e = Number(expText)
  const sign = value < 0 ? '-' : ''
  const digits = mantissa.replace('.', '')

  let fixed: string
  if (e < 0) fixed = `0.${'0'.repeat(-e - 1)}${digits}`
  else if (e >= n - 1) {
    fixed = digits + '0'.repeat(e - (n - 1))
    // 10. or 1500. — a trailing point marks the last zero as measured.
    if (e === n - 1 && digits.endsWith('0')) fixed += '.'
  } else fixed = `${digits.slice(0, e + 1)}.${digits.slice(e + 1)}`

  return { fixed: sign + fixed, scientific: `${sign}${mantissa} × 10^${e}` }
}

function roundToDecimalPlaces(value: number, dp: number): string {
  const clean = Number(value.toPrecision(12))
  if (dp >= 0) return clean.toFixed(dp)
  const unit = 10 ** -dp
  return String(Math.round(clean / unit) * unit)
}

const SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' } as const

export function sigFigArithmetic(
  op: '+' | '-' | '*' | '/',
  a: string,
  b: string,
): Result<{ raw: number; rounded: string; rule: string; steps: Step[] }> {
  const ca = countSigFigs(a)
  if (!ca.ok) return fail(`First number: ${ca.error}`)
  const cb = countSigFigs(b)
  if (!cb.ok) return fail(`Second number: ${cb.error}`)
  const x = parseMeasurement(a)!
  const y = parseMeasurement(b)!
  if (op === '/' && y === 0) return fail('You can’t divide by zero.')

  const raw = op === '+' ? x + y : op === '-' ? x - y : op === '*' ? x * y : x / y
  const steps: Step[] = [{ label: 'Calculate', detail: `${a.trim()} ${SYMBOL[op]} ${b.trim()} = ${Number(raw.toPrecision(12))}` }]
  let rounded: string
  let rule: string

  if (op === '+' || op === '-') {
    const dp = Math.min(ca.value.decimalPlaces, cb.value.decimalPlaces)
    rounded = roundToDecimalPlaces(raw, dp)
    const where = dp > 0 ? `${dp} decimal place${dp === 1 ? '' : 's'}` : dp === 0 ? 'the ones place' : `the ${10 ** -dp}s place`
    rule = 'Addition and subtraction: round to the fewest decimal places of any input.'
    steps.push({ label: 'Least precise place', detail: `The less precise input ends at ${where}.` })
  } else {
    const n = Math.min(ca.value.count, cb.value.count)
    rounded = roundToSigFigs(raw, n).fixed
    rule = 'Multiplication and division: round to the fewest significant figures of any input.'
    steps.push({ label: 'Fewest sig figs', detail: `${a.trim()} has ${ca.value.count}, ${b.trim()} has ${cb.value.count} → keep ${n}.` })
  }
  steps.push({ label: 'Round', detail: `${Number(raw.toPrecision(12))} → ${rounded}` })
  if (ca.value.ambiguous || cb.value.ambiguous) {
    steps.push({ label: 'Note', detail: 'One input has trailing zeros with no decimal point, so those zeros were treated as not significant.' })
  }
  return ok({ raw, rounded, rule, steps })
}
