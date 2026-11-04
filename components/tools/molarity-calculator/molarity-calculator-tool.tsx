'use client'

import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { molarity, solveDilution } from '@/lib/chemistry/molarity'
import { parseNumberInput } from '@/lib/input'
import type { Result } from '@/lib/result'

type Unit = 'mL' | 'L'
const TO_L: Record<Unit, number> = { mL: 0.001, L: 1 }
const fmt = (n: number) => String(Number(n.toPrecision(5)))

function UnitSelect({ id, value, onChange, label = 'Volume unit' }: { id: string; value: Unit; onChange: (u: Unit) => void; label?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value as Unit)}>
        <option value="mL">mL</option>
        <option value="L">L</option>
      </NativeSelect>
    </div>
  )
}

function field(label: string, raw: string): Result<number> {
  const p = parseNumberInput(raw)
  return p.ok ? p : { ok: false, error: `${label}: ${p.error}` }
}

function MolarityMode() {
  const [source, setSource] = React.useState<'grams' | 'moles'>('grams')
  const [formula, setFormula] = React.useState('NaCl')
  const [grams, setGrams] = React.useState('5.844')
  const [moles, setMoles] = React.useState('0.1')
  const [volume, setVolume] = React.useState('500')
  const [unit, setUnit] = React.useState<Unit>('mL')

  const vol = field('Volume', volume)
  const amount = field(source === 'grams' ? 'Mass' : 'Moles', source === 'grams' ? grams : moles)
  const result = !amount.ok
    ? amount
    : !vol.ok
      ? vol
      : molarity(
          source === 'grams'
            ? { grams: amount.value, formula, volumeL: vol.value * TO_L[unit] }
            : { moles: amount.value, volumeL: vol.value * TO_L[unit] },
        )

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mo-source">I know the solute’s</Label>
            <NativeSelect id="mo-source" value={source} onChange={(e) => setSource(e.target.value as 'grams' | 'moles')}>
              <option value="grams">Mass in grams (and formula)</option>
              <option value="moles">Amount in moles</option>
            </NativeSelect>
          </div>
          {source === 'grams' ? (
            <>
              <NumberField id="mo-formula" label="Solute formula" value={formula} onChange={setFormula} inputMode="text" hint="For example NaCl, KMnO4 or CuSO4·5H2O." />
              <NumberField id="mo-grams" label="Mass of solute" value={grams} onChange={setGrams} suffix="g" />
            </>
          ) : (
            <NumberField id="mo-moles" label="Moles of solute" value={moles} onChange={setMoles} suffix="mol" />
          )}
          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <NumberField id="mo-volume" label="Solution volume" value={volume} onChange={setVolume} hint="Total volume of the solution, not the water added." />
            <UnitSelect id="mo-unit" value={unit} onChange={setUnit} label="Unit" />
          </div>
        </div>
      }
      result={
        result.ok ? (
          <>
            <ResultValue label="Molarity" value={`${fmt(result.value.molarity)} M`} hint="mol of solute per liter of solution" />
            <StepsList steps={result.value.steps} />
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}

const DILUTION_FIELDS = [
  { key: 'c1', label: 'M₁ — starting concentration', suffix: 'M' },
  { key: 'v1', label: 'V₁ — volume of stock used', suffix: 'vol' },
  { key: 'c2', label: 'M₂ — final concentration', suffix: 'M' },
  { key: 'v2', label: 'V₂ — final total volume', suffix: 'vol' },
] as const

type DKey = (typeof DILUTION_FIELDS)[number]['key']

function DilutionMode() {
  const [values, setValues] = React.useState<Record<DKey, string>>({ c1: '2', v1: '50', c2: '0.5', v2: '' })
  const [unit, setUnit] = React.useState<Unit>('mL')

  const given: Partial<Record<DKey, number>> = {}
  let inputError: string | null = null
  for (const f of DILUTION_FIELDS) {
    if (values[f.key].trim() === '') continue
    const p = field(f.label.split(' — ')[0], values[f.key])
    if (!p.ok) {
      inputError = p.error
      break
    }
    given[f.key] = p.value
  }
  const result = inputError ? { ok: false as const, error: inputError } : solveDilution(given)
  const solvedField = result.ok ? DILUTION_FIELDS.find((f) => f.key === result.value.solvedFor)! : null

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">Fill in three values and leave the one you want blank.</p>
          {DILUTION_FIELDS.map((f) => (
            <NumberField
              key={f.key}
              id={`dil-${f.key}`}
              label={f.label}
              value={values[f.key]}
              onChange={(v) => setValues((p) => ({ ...p, [f.key]: v }))}
              suffix={f.suffix === 'M' ? 'M' : unit}
            />
          ))}
          <UnitSelect id="dil-unit" value={unit} onChange={setUnit} />
        </div>
      }
      result={
        result.ok && solvedField ? (
          <>
            <ResultValue
              label={solvedField.label.split(' — ')[1].replace(/^./, (c) => c.toUpperCase())}
              value={`${fmt(result.value.value)} ${solvedField.suffix === 'M' ? 'M' : unit}`}
            />
            {result.value.warning && <p className="mt-3 rounded-card bg-accent-soft p-3 text-sm text-ink">{result.value.warning}</p>}
            <StepsList steps={result.value.steps} />
          </>
        ) : (
          <ResultMessage>{result.ok ? null : result.error}</ResultMessage>
        )
      }
    />
  )
}

export function MolarityCalculatorTool() {
  return (
    <Tabs defaultValue="molarity">
      <TabsList className="w-full">
        <TabsTrigger value="molarity" className="flex-1">
          Molarity
        </TabsTrigger>
        <TabsTrigger value="dilution" className="flex-1">
          Dilution (M₁V₁ = M₂V₂)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="molarity">
        <MolarityMode />
      </TabsContent>
      <TabsContent value="dilution">
        <DilutionMode />
      </TabsContent>
    </Tabs>
  )
}
