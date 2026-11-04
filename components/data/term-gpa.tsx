'use client'

import * as React from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { parseNumberInput } from '@/lib/input'
import { termGpa } from '@/lib/gpa/term-gpa'
import { gradeOptionLabel } from '@/lib/gpa/scale'

interface Row {
  id: number
  grade: string
  units: string
}

/** Term GPA on one college's own scale: units-weighted, with its non-GPA grades left out. */
export function TermGpa({
  scale,
  nonGpaGrades,
  unitLabel = 'Units',
}: {
  scale: { letter: string; points: number }[]
  nonGpaGrades: string[]
  unitLabel?: string
}) {
  const nextId = React.useRef(4)
  const [rows, setRows] = React.useState<Row[]>([
    { id: 1, grade: 'A', units: '4' },
    { id: 2, grade: 'B+', units: '4' },
    { id: 3, grade: '', units: '' },
  ])

  const update = (id: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const filled = rows.filter((r) => r.grade !== '')
  const unitsError = filled.map((r) => parseNumberInput(r.units)).find((p) => !p.ok)
  const result =
    filled.length === 0
      ? null
      : unitsError && !unitsError.ok
        ? { ok: false as const, error: `Units: ${unitsError.error}` }
        : termGpa(
            filled.map((r) => ({ grade: r.grade, units: Number(r.units) })),
            scale,
            nonGpaGrades,
          )

  return (
    <ToolShell
      inputs={
        <div>
          <div className="mb-2 grid grid-cols-[1fr_1fr_2.5rem] gap-2 text-sm font-medium text-ink">
            <span id="tg-grade">Grade</span>
            <span id="tg-units">{unitLabel}</span>
          </div>
          <ul className="space-y-2">
            {rows.map((row, i) => (
              <li key={row.id} className="grid grid-cols-[1fr_1fr_2.5rem] gap-2">
                <NativeSelect
                  aria-label={`Course ${i + 1} grade`}
                  value={row.grade}
                  onChange={(e) => update(row.id, { grade: e.target.value })}
                >
                  <option value="">—</option>
                  {scale.map((s) => (
                    <option key={s.letter} value={s.letter}>
                      {gradeOptionLabel(s.letter, s.points)}
                    </option>
                  ))}
                  {nonGpaGrades.map((g) => (
                    <option key={g} value={g}>
                      {g} (not in GPA)
                    </option>
                  ))}
                </NativeSelect>
                <Input
                  aria-label={`Course ${i + 1} ${unitLabel.toLowerCase()}`}
                  type="text"
                  inputMode="decimal"
                  className="figures"
                  value={row.units}
                  onChange={(e) => update(row.id, { units: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove course ${i + 1}`}
                  disabled={rows.length === 1}
                  onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
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
            onClick={() => setRows((prev) => [...prev, { id: nextId.current++, grade: '', units: '' }])}
          >
            <Plus className="size-4" aria-hidden /> Add course
          </Button>
        </div>
      }
      result={
        result === null ? (
          <ResultMessage>Pick a grade for at least one course.</ResultMessage>
        ) : result.ok ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ResultValue label="Term GPA" value={result.value.gpa.toFixed(2)} />
              <ResultStat label={`${unitLabel} in GPA`} value={String(result.value.totalUnits)} />
            </div>
            <StepsList steps={result.value.steps} />
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}
