'use client'

import * as React from 'react'

import { NumberField } from '@/components/tools/number-field'
import { countField, EstimateNote, ScoreEstimate } from '@/components/tools/test-prep/score-estimate'
import { ResultMessage, ToolShell } from '@/components/tools/tool-shell'
import { DIGITAL_QUESTIONS, estimateSat } from '@/lib/test-prep/sat'

export function SatScoreCalculatorTool() {
  const [rw, setRw] = React.useState('40')
  const [math, setMath] = React.useState('32')

  const rwCount = countField('Reading and Writing', rw)
  const mathCount = countField('Math', math)
  const result = !rwCount.ok ? rwCount : !mathCount.ok ? mathCount : estimateSat({ rwCorrect: rwCount.value, mathCorrect: mathCount.value })

  return (
    <ToolShell
      inputs={
        <>
          <NumberField id="sat-rw" label="Reading and Writing — questions correct" value={rw} onChange={setRw} inputMode="numeric" suffix={`of ${DIGITAL_QUESTIONS.rw}`} />
          <NumberField id="sat-math" label="Math — questions correct" value={math} onChange={setMath} inputMode="numeric" suffix={`of ${DIGITAL_QUESTIONS.math}`} />
          <p className="text-sm text-ink-muted">Count both modules of each section together, from a full-length practice test.</p>
        </>
      }
      result={
        result.ok ? (
          <>
            <ScoreEstimate label="Total score (400–1600)" range={result.value.total} size="value" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ScoreEstimate label="Reading and Writing" range={result.value.rw} />
              <ScoreEstimate label="Math" range={result.value.math} />
            </div>
            <EstimateNote>
              This is an estimate. The digital SAT is adaptive: which second module you get, and how hard each question is, changes
              the score a raw count is worth, so the same number correct can score differently on different test forms.
            </EstimateNote>
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}
