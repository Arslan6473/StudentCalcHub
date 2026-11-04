'use client'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { NumberField } from '@/components/tools/number-field'
import { countField, EstimateNote, ScoreEstimate } from '@/components/tools/test-prep/score-estimate'
import { ResultMessage, ToolShell } from '@/components/tools/tool-shell'
import type { Result } from '@/lib/result'
import { ACT_QUESTIONS, actComposite, actStem, estimateActSection, type ActSection } from '@/lib/test-prep/act'
import type { ScoreRange } from '@/lib/test-prep/curve'

const SECTIONS: { key: ActSection; label: string }[] = [
  { key: 'english', label: 'English' },
  { key: 'math', label: 'Math' },
  { key: 'reading', label: 'Reading' },
  { key: 'science', label: 'Science' },
]

function estimate(key: ActSection, label: string, raw: string): Result<ScoreRange> {
  const c = countField(label, raw)
  return c.ok ? estimateActSection(key, c.value) : c
}

export function ActScoreCalculatorTool() {
  const [counts, setCounts] = React.useState<Record<ActSection, string>>({ english: '38', math: '30', reading: '26', science: '28' })
  const [withScience, setWithScience] = React.useState(false)

  const active = SECTIONS.filter((s) => withScience || s.key !== 'science')
  const ranges = {} as Partial<Record<ActSection, ScoreRange>>
  let error: string | null = null
  for (const s of active) {
    const r = estimate(s.key, s.label, counts[s.key])
    if (!r.ok) {
      error = r.error
      break
    }
    ranges[s.key] = r.value
  }

  const { english: e, math: m, reading: r, science: s } = ranges
  const composite =
    !error && e && m && r
      ? { low: actComposite(e.low, m.low, r.low), mid: actComposite(e.mid, m.mid, r.mid), high: actComposite(e.high, m.high, r.high) }
      : null

  return (
    <ToolShell
      inputs={
        <>
          {active.map((sec) => (
            <NumberField
              key={sec.key}
              id={`act-${sec.key}`}
              label={`${sec.label} — questions correct`}
              value={counts[sec.key]}
              onChange={(v) => setCounts((p) => ({ ...p, [sec.key]: v }))}
              inputMode="numeric"
              suffix={`of ${ACT_QUESTIONS[sec.key]}`}
            />
          ))}
          <div className="flex items-center gap-3">
            <Switch id="act-science" checked={withScience} onCheckedChange={setWithScience} />
            <Label htmlFor="act-science">Include science (optional section)</Label>
          </div>
        </>
      }
      result={
        composite && e && m && r ? (
          <>
            <ScoreEstimate label="Composite (1–36)" range={composite} size="value" />
            <div className="mt-4 grid grid-cols-3 gap-4">
              <ScoreEstimate label="English" range={e} />
              <ScoreEstimate label="Math" range={m} />
              <ScoreEstimate label="Reading" range={r} />
            </div>
            {withScience && s && (
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
                <ScoreEstimate label="Science" range={s} />
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                    STEM score <Badge variant="outline">Estimate</Badge>
                  </p>
                  <p className="figures mt-1 text-lg font-semibold text-ink">{actStem(m.mid, s.mid)}</p>
                  <p className="text-xs text-ink-subtle">average of Math and Science</p>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs text-ink-subtle">
              Composite = ({e.mid} + {m.mid} + {r.mid}) ÷ 3, rounded to the nearest whole number (.5 rounds up). Science is not part of
              the composite.
            </p>
            <EstimateNote>
              This is an estimate. ACT scales each test form separately, so the same number correct can be worth a point or two more or
              less on a different form.
            </EstimateNote>
          </>
        ) : (
          <ResultMessage>{error}</ResultMessage>
        )
      }
    />
  )
}
