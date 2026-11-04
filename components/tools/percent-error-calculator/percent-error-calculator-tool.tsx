'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { autoSigFigs, percentError } from '@/lib/chemistry/percent-error'
import { parseMeasurement } from '@/lib/chemistry/sig-figs'

export function PercentErrorCalculatorTool() {
  const [experimental, setExperimental] = React.useState('52.3')
  const [accepted, setAccepted] = React.useState('50.0')
  const [signed, setSigned] = React.useState(false)
  const [sigFigs, setSigFigs] = React.useState('auto')

  const exp = parseMeasurement(experimental)
  const acc = parseMeasurement(accepted)
  // "Auto" applies the subtraction rule to the difference, then the division rule.
  const auto = autoSigFigs(experimental, accepted)
  const autoN = auto.ok ? auto.value.n : undefined
  const n = sigFigs === 'auto' ? autoN : sigFigs === 'none' ? undefined : Number(sigFigs)

  const result =
    exp === null
      ? { ok: false as const, error: 'Experimental value: enter a number like 52.3 or 5.23e1.' }
      : acc === null
        ? { ok: false as const, error: 'Accepted value: enter a number like 50.0 or 5.00e1.' }
        : percentError({ experimental: exp, accepted: acc, signed, sigFigs: n })

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <NumberField
            id="pe-experimental"
            label="Experimental (measured) value"
            value={experimental}
            onChange={setExperimental}
            hint="What you measured in lab. Type it with all its digits."
            inputMode="text"
          />
          <NumberField
            id="pe-accepted"
            label="Accepted (true) value"
            value={accepted}
            onChange={setAccepted}
            hint="The textbook or literature value."
            inputMode="text"
          />
          <div className="space-y-1.5">
            <Label htmlFor="pe-sigfigs">Round answer to</Label>
            <NativeSelect id="pe-sigfigs" value={sigFigs} onChange={(e) => setSigFigs(e.target.value)}>
              <option value="auto">Auto — sig fig rules{autoN ? ` (${autoN})` : ''}</option>
              {[1, 2, 3, 4, 5].map((k) => (
                <option key={k} value={k}>
                  {k} significant figure{k === 1 ? '' : 's'}
                </option>
              ))}
              <option value="none">Don’t round</option>
            </NativeSelect>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input id="pe-signed" type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} className="size-4 accent-accent" />
            Keep the sign (negative when your value is low)
          </label>
        </div>
      }
      result={
        result.ok ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ResultValue label="Percent error" value={result.value.display} />
              <ResultStat label="Absolute error" value={String(Number(result.value.absoluteError.toPrecision(6)))} />
            </div>
            <StepsList
              steps={
                // Auto's reasoning goes just before the final Round step.
                sigFigs === 'auto' && auto.ok
                  ? [...result.value.steps.slice(0, -1), ...auto.value.steps, ...result.value.steps.slice(-1)]
                  : result.value.steps
              }
            />
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}
