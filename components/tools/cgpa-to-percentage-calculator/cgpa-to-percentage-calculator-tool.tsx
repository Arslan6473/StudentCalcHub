'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { CGPA_PRESETS, cgpaToPercent, findPreset, formatNumber, parseFormula, percentToCgpa, type CgpaConversion, type CgpaFormula } from '@/lib/gpa/cgpa'
import type { Result } from '@/lib/result'

type Mode = 'cgpa' | 'percent'

const CUSTOM = 'custom'

const MODES: {
  mode: Mode
  tab: string
  label: string
  placeholder: string
  hint: string
  convert: (raw: string, formula: CgpaFormula) => Result<CgpaConversion>
}[] = [
  { mode: 'cgpa', tab: 'CGPA → %', label: 'CGPA (10-point scale)', placeholder: '8.6', hint: 'Between 0 and 10, as printed on your marksheet.', convert: cgpaToPercent },
  { mode: 'percent', tab: '% → CGPA', label: 'Percentage', placeholder: '81.7', hint: 'Between 0 and 100.', convert: percentToCgpa },
]

export function CgpaToPercentageCalculatorTool() {
  const [values, setValues] = React.useState<Record<Mode, string>>({ cgpa: '8.6', percent: '81.7' })
  const [presetId, setPresetId] = React.useState('cbse')
  const [multiplier, setMultiplier] = React.useState('10')
  const [offset, setOffset] = React.useState('0.75')

  const preset = findPreset(presetId)
  const formula: Result<CgpaFormula> = preset ? { ok: true, value: preset.formula } : parseFormula(multiplier, offset)

  const formulaInputs = (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="cgpa-formula">Conversion formula</Label>
        <NativeSelect id="cgpa-formula" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
          {CGPA_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          <option value={CUSTOM}>My university’s formula (custom)</option>
        </NativeSelect>
        {preset ? (
          <p className="text-xs text-ink-subtle">
            {preset.appliesTo}{' '}
            <a href={preset.source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
              Source
            </a>
          </p>
        ) : (
          <p className="text-xs text-ink-subtle">Percentage = (CGPA − offset) × multiplier. Copy the numbers from your transcript or university notice.</p>
        )}
      </div>
      {!preset && (
        <div className="grid grid-cols-2 gap-4">
          <NumberField id="cgpa-multiplier" label="Multiplier" value={multiplier} onChange={setMultiplier} placeholder="10" hint="e.g. 9.5 or 10" />
          <NumberField id="cgpa-offset" label="Offset" value={offset} onChange={setOffset} placeholder="0" hint="0 if there is none" />
        </div>
      )}
    </>
  )

  return (
    <div>
      <Tabs defaultValue="cgpa">
        <TabsList className="w-full">
          {MODES.map((m) => (
            <TabsTrigger key={m.mode} value={m.mode} className="flex-1">
              {m.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {MODES.map((m) => {
          const result = formula.ok ? m.convert(values[m.mode], formula.value) : formula
          return (
            <TabsContent key={m.mode} value={m.mode}>
              <ToolShell
                inputs={
                  <>
                    <NumberField
                      id={`cgpa-${m.mode}`}
                      label={m.label}
                      value={values[m.mode]}
                      onChange={(v) => setValues((prev) => ({ ...prev, [m.mode]: v }))}
                      placeholder={m.placeholder}
                      hint={m.hint}
                      suffix={m.mode === 'percent' ? '%' : undefined}
                    />
                    {formulaInputs}
                  </>
                }
                result={
                  result.ok ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        {m.mode === 'cgpa' ? (
                          <>
                            <ResultValue label="Percentage" value={`${formatNumber(result.value.percent)}%`} />
                            <ResultStat label="CGPA" value={formatNumber(result.value.cgpa)} />
                          </>
                        ) : (
                          <>
                            <ResultValue label="CGPA" value={formatNumber(result.value.cgpa)} />
                            <ResultStat label="Percentage" value={`${formatNumber(result.value.percent)}%`} />
                          </>
                        )}
                      </div>
                      <StepsList steps={result.value.steps} />
                      <p className="mt-4 text-xs text-ink-subtle">
                        An equivalent percentage, not your actual marks. The official figure is whatever your own board or university publishes.
                      </p>
                    </>
                  ) : (
                    <ResultMessage>{result.error}</ResultMessage>
                  )
                }
              />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
