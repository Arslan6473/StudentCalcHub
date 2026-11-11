'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import {
  convertScale,
  GERMAN_LABEL,
  SCALES,
  type ScaleId,
  type TargetId,
} from '@/lib/gpa/scale-converter'

function passDefault(id: ScaleId): string {
  return SCALES.find((s) => s.id === id)?.pass?.toString() ?? ''
}

function ScaleSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  withGerman,
}: {
  id: string
  label: string
  value: T
  onChange: (v: T) => void
  withGerman?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {SCALES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
        {withGerman && <option value="german">{GERMAN_LABEL}</option>}
      </NativeSelect>
    </div>
  )
}

export function GpaScaleConverterTool() {
  const [from, setFrom] = React.useState<ScaleId>('ten')
  const [to, setTo] = React.useState<TargetId>('us4')
  const [value, setValue] = React.useState('8.5')
  const [customMin, setCustomMin] = React.useState('0')
  const [customMax, setCustomMax] = React.useState('')
  const [passing, setPassing] = React.useState(passDefault('ten'))

  const changeFrom = (id: ScaleId) => {
    setFrom(id)
    // Only scales with an officially stated pass mark pre-fill it; otherwise the student types their own.
    setPassing(passDefault(id))
  }

  const usesCustom = from === 'custom' || to === 'custom'
  const result = convertScale({
    value,
    from,
    to,
    custom: { min: customMin, max: customMax },
    passing,
  })

  return (
    <div>
      <ToolShell
        inputs={
          <div className="space-y-4">
            <ScaleSelect id="gsc-from" label="From scale" value={from} onChange={changeFrom} />
            <NumberField
              id="gsc-value"
              label="Your grade"
              value={value}
              onChange={setValue}
              placeholder="8.5"
              hint="Your overall GPA, CGPA or average on that scale."
            />
            <ScaleSelect id="gsc-to" label="To scale" value={to} onChange={setTo} withGerman />
            {usesCustom && (
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="gsc-custom-min"
                  label="Custom lowest grade"
                  value={customMin}
                  onChange={setCustomMin}
                />
                <NumberField
                  id="gsc-custom-max"
                  label="Custom highest grade"
                  value={customMax}
                  onChange={setCustomMax}
                  placeholder="e.g. 9"
                />
              </div>
            )}
            {to === 'german' && (
              <NumberField
                id="gsc-pass"
                label="Lowest passing grade on your scale (Nmin)"
                value={passing}
                onChange={setPassing}
                placeholder="From your transcript"
                hint="Use the minimum pass mark printed on your transcript or set by your university."
              />
            )}
          </div>
        }
        result={
          result.ok ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultValue
                  label={result.value.targetLabel}
                  value={result.value.display}
                  hint={result.value.failing ? 'Below the pass mark' : 'Estimate'}
                />
                <ResultStat
                  label="Method"
                  value={
                    result.value.method === 'bavarian'
                      ? 'Modified Bavarian formula'
                      : 'Linear (proportional)'
                  }
                />
              </div>
              <StepsList steps={result.value.steps} />
              <p className="text-ink-subtle mt-4 text-xs">
                This is an estimate. Universities and credential evaluators such as WES use their
                own tables — check the official method for each application.
              </p>
            </>
          ) : (
            <ResultMessage>{result.error}</ResultMessage>
          )
        }
      />

      <section className="mt-8 max-w-3xl" aria-labelledby="gsc-scales-heading">
        <h2 id="gsc-scales-heading" className="text-ink mb-3 text-xl font-semibold">
          Scales in this converter
        </h2>
        <div className="rounded-card border-line overflow-x-auto border">
          <table className="figures w-full text-sm">
            <thead className="border-line bg-surface-muted border-b text-left">
              <tr>
                <th className="text-ink-muted px-3 py-2 font-medium">Scale</th>
                <th className="text-ink-muted px-3 py-2 font-medium">Range used</th>
                <th className="text-ink-muted px-3 py-2 font-medium">Pass mark pre-filled</th>
              </tr>
            </thead>
            <tbody>
              {SCALES.filter((s) => s.id !== 'custom').map((s) => (
                <tr key={s.id} className="border-line border-b last:border-b-0">
                  <td className="text-ink px-3 py-2 font-medium">{s.label}</td>
                  <td className="px-3 py-2">
                    {s.min}–{s.max}
                  </td>
                  <td className="px-3 py-2">{s.pass ?? 'Enter your own'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-ink-muted mt-3 text-sm">
          Pass marks differ between universities and even programmes, so only two are pre-filled: 4
          on the Australian 7-point scale and 10 on the French 0–20 scale. For every other scale,
          type the pass mark from your own transcript before converting to a German grade.
        </p>
      </section>
    </div>
  )
}
