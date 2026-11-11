'use client'

import * as React from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { parseNumberInput } from '@/lib/input'
import { fail, ok, type Result } from '@/lib/result'
import { ukDegreeClassification, UK_CLASSES, type UkYear } from '@/lib/gpa/uk-degree'

interface Row {
  id: number
  name: string
  credits: string
  mark: string
}

interface YearState {
  id: number
  weight: string
  rows: Row[]
}

const MAX_YEARS = 4
// Years are numbered from Year 2, since first-year marks usually don't count.
const yearLabel = (i: number) => `Year ${i + 2}`

const textProps = {
  autoComplete: 'off',
  autoCapitalize: 'none',
  autoCorrect: 'off',
  spellCheck: false,
} as const

/** Parses every filled row; blank rows (no credits and no mark) are skipped. */
function toYears(years: YearState[]): Result<UkYear[]> {
  const out: UkYear[] = []
  for (const [yi, year] of years.entries()) {
    const label = yearLabel(yi)
    const weight = parseNumberInput(year.weight)
    if (!weight.ok) return fail(`${label} weighting: ${weight.error}`)
    const modules: UkYear['modules'] = []
    for (const [ri, row] of year.rows.entries()) {
      if (row.credits.trim() === '' && row.mark.trim() === '') continue
      const which = `${label}, ${row.name.trim() || `module ${ri + 1}`}`
      const credits = parseNumberInput(row.credits)
      if (!credits.ok) return fail(`${which} credits: ${credits.error}`)
      const mark = parseNumberInput(row.mark)
      if (!mark.ok) return fail(`${which} mark: ${mark.error}`)
      modules.push({ name: row.name, credits: credits.value, mark: mark.value })
    }
    out.push({ label, weight: weight.value, modules })
  }
  return ok(out)
}

function YearCard({
  index,
  year,
  onChange,
  nextId,
}: {
  index: number
  year: YearState
  onChange: (patch: Partial<YearState>) => void
  nextId: () => number
}) {
  const label = yearLabel(index)
  const update = (id: number, patch: Partial<Row>) =>
    onChange({ rows: year.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) })

  return (
    <fieldset className="rounded-card border-line space-y-3 border p-4">
      <legend className="text-ink px-1 text-sm font-semibold">{label}</legend>
      <NumberField
        id={`ukd-weight-${year.id}`}
        label="Weighting"
        value={year.weight}
        onChange={(weight) => onChange({ weight })}
        hint="Relative share, e.g. 1 and 2, or 40 and 60. Use 0 if this year doesn’t count."
      />
      <div>
        <div className="text-ink mb-2 grid grid-cols-[1fr_4.5rem_4.5rem_2.5rem] gap-2 text-sm font-medium">
          <span>Module (optional)</span>
          <span>Credits</span>
          <span>Mark %</span>
        </div>
        <ul className="space-y-2">
          {year.rows.map((row, i) => (
            <li key={row.id} className="grid grid-cols-[1fr_4.5rem_4.5rem_2.5rem] gap-2">
              <Input
                aria-label={`${label} module ${i + 1} name`}
                type="text"
                {...textProps}
                autoCapitalize="sentences"
                value={row.name}
                onChange={(e) => update(row.id, { name: e.target.value })}
              />
              <Input
                aria-label={`${label} module ${i + 1} credits`}
                type="text"
                inputMode="decimal"
                {...textProps}
                className="figures"
                value={row.credits}
                onChange={(e) => update(row.id, { credits: e.target.value })}
              />
              <Input
                aria-label={`${label} module ${i + 1} mark`}
                type="text"
                inputMode="decimal"
                {...textProps}
                className="figures"
                value={row.mark}
                onChange={(e) => update(row.id, { mark: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${label} module ${i + 1}`}
                disabled={year.rows.length === 1}
                onClick={() => onChange({ rows: year.rows.filter((r) => r.id !== row.id) })}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() =>
            onChange({ rows: [...year.rows, { id: nextId(), name: '', credits: '', mark: '' }] })
          }
        >
          <Plus className="size-4" aria-hidden /> Add module
        </Button>
      </div>
    </fieldset>
  )
}

export function UkDegreeClassificationCalculatorTool() {
  const idRef = React.useRef(100)
  const nextId = () => idRef.current++
  // Prefilled with the worked example from the guide below (1 : 2 weighting).
  const [years, setYears] = React.useState<YearState[]>([
    {
      id: 1,
      weight: '1',
      rows: [
        { id: 2, name: '', credits: '40', mark: '58' },
        { id: 3, name: '', credits: '40', mark: '64' },
        { id: 4, name: '', credits: '40', mark: '61' },
      ],
    },
    {
      id: 5,
      weight: '2',
      rows: [
        { id: 6, name: 'Dissertation', credits: '40', mark: '72' },
        { id: 7, name: '', credits: '40', mark: '66' },
        { id: 8, name: '', credits: '40', mark: '69' },
      ],
    },
  ])

  const updateYear = (id: number, patch: Partial<YearState>) =>
    setYears((prev) => prev.map((y) => (y.id === id ? { ...y, ...patch } : y)))

  const parsed = toYears(years)
  const result = parsed.ok ? ukDegreeClassification(parsed.value) : parsed

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          {years.map((year, i) => (
            <YearCard
              key={year.id}
              index={i}
              year={year}
              onChange={(patch) => updateYear(year.id, patch)}
              nextId={nextId}
            />
          ))}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={years.length >= MAX_YEARS}
              onClick={() =>
                setYears((prev) => [
                  ...prev,
                  {
                    id: nextId(),
                    weight: '0',
                    rows: [{ id: nextId(), name: '', credits: '', mark: '' }],
                  },
                ])
              }
            >
              <Plus className="size-4" aria-hidden /> Add year
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={years.length === 1}
              onClick={() => setYears((prev) => prev.slice(0, -1))}
            >
              <X className="size-4" aria-hidden /> Remove {yearLabel(years.length - 1)}
            </Button>
          </div>
        </div>
      }
      result={
        result.ok ? (
          <>
            <ResultValue
              label="Likely classification"
              value={`${result.value.classification.name}${result.value.classification.min > 0 ? ` (${result.value.classification.short})` : ''}`}
              hint="On the usual 70 / 60 / 50 / 40 boundaries"
            />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <ResultStat label="Overall average" value={result.value.overall.toFixed(2)} />
              {result.value.years.map((y) => (
                <ResultStat
                  key={y.label}
                  label={`${y.label} (${Number((y.share * 100).toFixed(1))}%)`}
                  value={y.average.toFixed(2)}
                />
              ))}
            </div>
            {result.value.borderline && (
              <p className="rounded-card bg-accent-soft text-ink mt-4 px-4 py-3 text-sm">
                You are {Number(result.value.borderline.gap.toFixed(2))} below the{' '}
                {result.value.borderline.next.short} boundary. Many universities have a borderline
                zone just under each boundary where a rule (such as how many credits are in the
                higher class) or the exam board can lift you up. Check your own university’s
                regulations.
              </p>
            )}
            <StepsList steps={result.value.steps} />
            <p className="text-ink-subtle mt-4 text-xs">
              Boundaries:{' '}
              {UK_CLASSES.filter((c) => c.min > 0)
                .map((c) => `${c.short} ${c.min}+`)
                .join(' · ')}
              . Your university’s published algorithm (weightings, discounted credits, rounding,
              borderlines) decides your actual degree.
            </p>
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}
