'use client'

import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { parseNumberInput } from '@/lib/input'
import type { Result } from '@/lib/result'
import { sampleSizeMean, sampleSizeProportion, Z_SCORES, type Confidence } from '@/lib/statistics/sample-size'

const LEVELS = Object.keys(Z_SCORES) as Confidence[]

function field(label: string, raw: string): Result<number> {
  const p = parseNumberInput(raw)
  return p.ok ? p : { ok: false, error: `${label}: ${p.error}` }
}

/** Blank population means "very large"; anything else must parse. */
function optionalPopulation(raw: string): Result<number | undefined> {
  if (raw.trim() === '') return { ok: true, value: undefined }
  return field('Population size', raw)
}

function ConfidenceSelect({ id, value, onChange }: { id: string; value: Confidence; onChange: (c: Confidence) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Confidence level</Label>
      <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value as Confidence)}>
        {LEVELS.map((c) => (
          <option key={c} value={c}>
            {c}% (z = {Z_SCORES[c]})
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

function SampleSizeResult({ result }: { result: ReturnType<typeof sampleSizeProportion> }) {
  if (!result.ok) return <ResultMessage>{result.error}</ResultMessage>
  const corrected = result.value.n !== result.value.nInfinite
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <ResultValue label="Sample size needed" value={result.value.n.toLocaleString('en-US')} hint="responses, rounded up" />
        {corrected && <ResultStat label="Without population limit" value={result.value.nInfinite.toLocaleString('en-US')} />}
      </div>
      <StepsList steps={result.value.steps} />
    </>
  )
}

function ProportionMode() {
  const [confidence, setConfidence] = React.useState<Confidence>('95')
  const [margin, setMargin] = React.useState('5')
  const [p, setP] = React.useState('50')
  const [population, setPopulation] = React.useState('')

  const m = field('Margin of error', margin)
  const pp = field('Expected proportion', p)
  const pop = optionalPopulation(population)
  const result = !m.ok
    ? m
    : !pp.ok
      ? pp
      : !pop.ok
        ? pop
        : sampleSizeProportion({ confidence, marginOfError: m.value / 100, p: pp.value / 100, population: pop.value })

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <ConfidenceSelect id="ss-p-conf" value={confidence} onChange={setConfidence} />
          <NumberField id="ss-p-margin" label="Margin of error" value={margin} onChange={setMargin} suffix="%" hint="±5% is common for class surveys." />
          <NumberField
            id="ss-p-prop"
            label="Expected proportion"
            value={p}
            onChange={setP}
            suffix="%"
            hint="Leave at 50% if you have no earlier estimate — it gives the largest, safest sample."
          />
          <NumberField id="ss-p-pop" label="Population size (optional)" value={population} onChange={setPopulation} placeholder="Leave blank if large or unknown" />
        </div>
      }
      result={<SampleSizeResult result={result as ReturnType<typeof sampleSizeProportion>} />}
    />
  )
}

function MeanMode() {
  const [confidence, setConfidence] = React.useState<Confidence>('95')
  const [margin, setMargin] = React.useState('2')
  const [sd, setSd] = React.useState('10')
  const [population, setPopulation] = React.useState('')

  const m = field('Margin of error', margin)
  const s = field('Standard deviation', sd)
  const pop = optionalPopulation(population)
  const result = !m.ok
    ? m
    : !s.ok
      ? s
      : !pop.ok
        ? pop
        : sampleSizeMean({ confidence, marginOfError: m.value, sd: s.value, population: pop.value })

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <ConfidenceSelect id="ss-m-conf" value={confidence} onChange={setConfidence} />
          <NumberField id="ss-m-margin" label="Margin of error" value={margin} onChange={setMargin} hint="In the same units as your measurement, e.g. ±2 points." />
          <NumberField
            id="ss-m-sd"
            label="Standard deviation (σ)"
            value={sd}
            onChange={setSd}
            hint="From a pilot study or earlier research. Same units as the margin."
          />
          <NumberField id="ss-m-pop" label="Population size (optional)" value={population} onChange={setPopulation} placeholder="Leave blank if large or unknown" />
        </div>
      }
      result={<SampleSizeResult result={result as ReturnType<typeof sampleSizeMean>} />}
    />
  )
}

export function SampleSizeCalculatorTool() {
  return (
    <Tabs defaultValue="proportion">
      <TabsList className="w-full">
        <TabsTrigger value="proportion" className="flex-1">
          Proportion (survey)
        </TabsTrigger>
        <TabsTrigger value="mean" className="flex-1">
          Mean
        </TabsTrigger>
      </TabsList>
      <TabsContent value="proportion">
        <ProportionMode />
      </TabsContent>
      <TabsContent value="mean">
        <MeanMode />
      </TabsContent>
    </Tabs>
  )
}
