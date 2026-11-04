'use client'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { countField, EstimateNote, ScoreEstimate } from '@/components/tools/test-prep/score-estimate'
import { ResultMessage, ToolShell } from '@/components/tools/tool-shell'
import { NMSQT } from '@/lib/data/nmsqt'
import { estimatePsat, selectionIndex } from '@/lib/test-prep/psat'
import { DIGITAL_QUESTIONS } from '@/lib/test-prep/sat'

function CutoffComparison({ index, state }: { index: number; state: string }) {
  const cutoff = NMSQT.cutoffs.find((c) => c.state === state)
  if (!cutoff) return null
  const gap = cutoff.index - index
  return (
    <p className="mt-3 text-sm text-ink">
      {state}’s Class of {NMSQT.classOf} Semifinalist cutoff (past) was <strong className="figures">{cutoff.index}</strong>.{' '}
      {gap <= 0
        ? 'Your estimated index is at or above it.'
        : `Your estimated index is ${gap} point${gap === 1 ? '' : 's'} below it.`}{' '}
      Cutoffs change every year.
    </p>
  )
}

export function PsatScoreCalculatorTool() {
  const [rw, setRw] = React.useState('44')
  const [math, setMath] = React.useState('36')
  const [state, setState] = React.useState('')

  const rwCount = countField('Reading and Writing', rw)
  const mathCount = countField('Math', math)
  const result = !rwCount.ok ? rwCount : !mathCount.ok ? mathCount : estimatePsat({ rwCorrect: rwCount.value, mathCorrect: mathCount.value })
  const index = result.ok ? selectionIndex(result.value.rw.mid, result.value.math.mid) : null

  return (
    <ToolShell
      inputs={
        <>
          <NumberField id="psat-rw" label="Reading and Writing — questions correct" value={rw} onChange={setRw} inputMode="numeric" suffix={`of ${DIGITAL_QUESTIONS.rw}`} />
          <NumberField id="psat-math" label="Math — questions correct" value={math} onChange={setMath} inputMode="numeric" suffix={`of ${DIGITAL_QUESTIONS.math}`} />
          <div className="space-y-1.5">
            <Label htmlFor="psat-state">Compare with a state (optional)</Label>
            <NativeSelect id="psat-state" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">— Choose a state —</option>
              {NMSQT.cutoffs.map((c) => (
                <option key={c.state} value={c.state}>
                  {c.state}
                </option>
              ))}
            </NativeSelect>
          </div>
        </>
      }
      result={
        result.ok && index !== null ? (
          <>
            <ScoreEstimate label="Total score (320–1520)" range={result.value.total} size="value" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ScoreEstimate label="Reading and Writing" range={result.value.rw} />
              <ScoreEstimate label="Math" range={result.value.math} />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <p className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                National Merit Selection Index (48–228) <Badge variant="outline">Estimate</Badge>
              </p>
              <p className="figures mt-1 text-2xl font-semibold text-ink">{index}</p>
              <p className="figures text-xs text-ink-subtle">
                (2 × {result.value.rw.mid} + {result.value.math.mid}) ÷ 10 · likely{' '}
                {selectionIndex(result.value.rw.low, result.value.math.low)}–{selectionIndex(result.value.rw.high, result.value.math.high)}
              </p>
              {state && <CutoffComparison index={index} state={state} />}
            </div>
            <EstimateNote>
              This is an estimate. The PSAT/NMSQT is adaptive like the digital SAT, so the score for a given number correct varies with
              the module you get and the test form. Only your official score report counts for National Merit.
            </EstimateNote>
          </>
        ) : (
          <ResultMessage>{result.ok ? null : result.error}</ResultMessage>
        )
      }
    />
  )
}
