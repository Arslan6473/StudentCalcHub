import { parseNumberInput } from '@/lib/input'
import { fail, ok, type Result } from '@/lib/result'
import type { Step } from '@/lib/steps'

/** Percentage = (CGPA − offset) × multiplier. A plain multiplier formula has offset 0. */
export interface CgpaFormula {
  multiplier: number
  offset: number
}

export interface CgpaPreset {
  id: string
  label: string
  formula: CgpaFormula
  /** Who the published formula covers, in the body's own terms. */
  appliesTo: string
  source: { label: string; url: string }
}

/**
 * Only formulas published by the board or university itself, each checked
 * against the linked notice. Every one is for a 10-point CGPA.
 */
export const CGPA_PRESETS: CgpaPreset[] = [
  {
    id: 'cbse',
    label: 'CBSE Class X (× 9.5)',
    formula: { multiplier: 9.5, offset: 0 },
    appliesTo: 'CBSE Class X results issued with a CGPA (the grading scheme introduced in 2009–10). Indicative only.',
    source: {
      label: 'CBSE Circular No. 24, 28 May 2010',
      url: 'https://www.cbse.gov.in/circulars/cir24-2010.pdf',
    },
  },
  {
    id: 'iisc',
    label: 'IISc Bangalore, 10-point (× 10)',
    formula: { multiplier: 10, offset: 0 },
    appliesTo: 'IISc students on the 10-point scale (joined from August 2016). IISc calls this a notional conversion.',
    source: {
      label: 'IISc notification IISc/Acad/CGPA-Conversion/2021, 14 Oct 2021',
      url: 'https://www.iisc.ac.in/wp-content/uploads/2021/10/IISc-CGPA-Percentage-Conversion-notification-signed.pdf',
    },
  },
  {
    id: 'cotton',
    label: 'Cotton University (× 10)',
    formula: { multiplier: 10, offset: 0 },
    appliesTo: 'All UG and PG examinations of Cotton University, from 28 Aug 2020.',
    source: {
      label: 'Cotton University notification, 28 Aug 2020',
      url: 'https://cottonuniversity.ac.in/storage/uploads/pdf/CGPA_to_PercentageNotification_280820.pdf',
    },
  },
  {
    id: 'mit-adt',
    label: 'MIT ADT University, Pune (× 9.56)',
    formula: { multiplier: 9.56, offset: 0 },
    appliesTo: 'MIT Art, Design and Technology University, Pune (circular of 20 May 2021).',
    source: {
      label: 'MIT ADT University circular MITADTU/Exam/2020-21/389',
      url: 'https://mituniversity.ac.in/assets_web/pdf/exam%20dept/Circular/8%20-%20Circular%20-%20CGPA%20To%20Percentage%20Formula.pdf',
    },
  },
]

export function findPreset(id: string): CgpaPreset | undefined {
  return CGPA_PRESETS.find((p) => p.id === id)
}

export interface CgpaConversion {
  cgpa: number
  percent: number
  steps: Step[]
}

/** Rounds to 2 decimal places for display and drops trailing zeros: 81.7, not 81.70000000000002. */
export function formatNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100
  return String(Object.is(rounded, -0) ? 0 : rounded)
}

/** 'CGPA × 9.5' or '(CGPA − 0.75) × 10', with any value in place of 'CGPA'. */
function formulaText(f: CgpaFormula, x: string): string {
  if (f.offset === 0) return `${x} × ${formatNumber(f.multiplier)}`
  const sign = f.offset > 0 ? '−' : '+'
  return `(${x} ${sign} ${formatNumber(Math.abs(f.offset))}) × ${formatNumber(f.multiplier)}`
}

/** Checks a custom formula typed by the student. */
export function parseFormula(rawMultiplier: string, rawOffset: string): Result<CgpaFormula> {
  const m = parseNumberInput(rawMultiplier)
  if (!m.ok) return fail(`Multiplier: ${m.error}`)
  if (m.value <= 0) return fail('The multiplier must be more than 0.')
  // A blank offset means a plain multiplier formula.
  const o = rawOffset.trim() === '' ? ok(0) : parseNumberInput(rawOffset)
  if (!o.ok) return fail(`Offset: ${o.error}`)
  if (Math.abs(o.value) >= 10) return fail('The offset must be between −10 and 10 on a 10-point scale.')
  return ok({ multiplier: m.value, offset: o.value })
}

export function cgpaToPercent(raw: string, formula: CgpaFormula): Result<CgpaConversion> {
  const parsed = parseNumberInput(raw)
  if (!parsed.ok) return parsed
  const cgpa = parsed.value
  if (cgpa < 0) return fail('A CGPA can’t be below 0.')
  if (cgpa > 10) return fail('This tool is for a 10-point CGPA, so it stops at 10.')

  const percent = (cgpa - formula.offset) * formula.multiplier
  if (percent < 0) return fail(`This formula gives a negative percentage below a CGPA of ${formatNumber(formula.offset)}, so it doesn’t apply here.`)
  if (percent > 100) return fail(`This formula gives ${formatNumber(percent)}% — over 100% — so it can’t be the right one for a 10-point CGPA.`)

  const steps: Step[] = [{ label: 'Formula', detail: `Percentage = ${formulaText(formula, 'CGPA')}` }]
  if (formula.offset !== 0) {
    steps.push({ label: 'Plug in', detail: `${formulaText(formula, String(cgpa))} = ${formatNumber(cgpa - formula.offset)} × ${formatNumber(formula.multiplier)}` })
  } else {
    steps.push({ label: 'Plug in', detail: formulaText(formula, String(cgpa)) })
  }
  steps.push({ label: 'Result', detail: `${formatNumber(percent)}%` })
  return ok({ cgpa, percent, steps })
}

export function percentToCgpa(raw: string, formula: CgpaFormula): Result<CgpaConversion> {
  const parsed = parseNumberInput(raw)
  if (!parsed.ok) return parsed
  const percent = parsed.value
  if (percent < 0) return fail('A percentage can’t be below 0.')
  if (percent > 100) return fail('A percentage can’t be above 100.')

  // Undo the formula: CGPA = percentage ÷ multiplier + offset.
  const cgpa = percent / formula.multiplier + formula.offset
  if (cgpa > 10) {
    const top = (10 - formula.offset) * formula.multiplier
    return fail(`The highest percentage this formula can give is ${formatNumber(top)}% (a CGPA of 10), so ${formatNumber(percent)}% has no CGPA on it.`)
  }
  if (cgpa < 0) return fail('That percentage works out below a CGPA of 0 with this formula.')

  const m = formatNumber(formula.multiplier)
  const steps: Step[] = [
    { label: 'Formula', detail: `Percentage = ${formulaText(formula, 'CGPA')}` },
    {
      label: 'Rearrange',
      detail: formula.offset === 0 ? `CGPA = percentage ÷ ${m}` : `CGPA = percentage ÷ ${m} ${formula.offset > 0 ? '+' : '−'} ${formatNumber(Math.abs(formula.offset))}`,
    },
  ]
  if (formula.offset === 0) {
    steps.push({ label: 'Plug in', detail: `${percent} ÷ ${m} = ${formatNumber(cgpa)}` })
  } else {
    const sign = formula.offset > 0 ? '+' : '−'
    steps.push({
      label: 'Plug in',
      detail: `${percent} ÷ ${m} ${sign} ${formatNumber(Math.abs(formula.offset))} = ${formatNumber(percent / formula.multiplier)} ${sign} ${formatNumber(Math.abs(formula.offset))} = ${formatNumber(cgpa)}`,
    })
  }
  return ok({ cgpa, percent, steps })
}
