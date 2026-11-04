'use client'

import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { gramsToMoles, molarMass, molesToGrams } from '@/lib/chemistry/formula'
import { parseNumberInput } from '@/lib/input'

type Direction = 'to-moles' | 'to-grams'

const fmt = (n: number) => String(Number(n.toPrecision(5)))

export function GramsToMolesCalculatorTool() {
  const [formula, setFormula] = React.useState('H2O')
  const [direction, setDirection] = React.useState<Direction>('to-moles')
  const [amount, setAmount] = React.useState<Record<Direction, string>>({ 'to-moles': '36.03', 'to-grams': '2' })

  const mm = molarMass(formula)
  const parsed = parseNumberInput(amount[direction])
  const toMoles = mm.ok && parsed.ok && direction === 'to-moles' ? gramsToMoles(parsed.value, mm.value.value) : null
  const toGrams = mm.ok && parsed.ok && direction === 'to-grams' ? molesToGrams(parsed.value, mm.value.value) : null
  const error = !mm.ok
    ? mm.error
    : !parsed.ok
      ? `${direction === 'to-moles' ? 'Mass' : 'Moles'}: ${parsed.error}`
      : toMoles && !toMoles.ok
        ? toMoles.error
        : toGrams && !toGrams.ok
          ? toGrams.error
          : null

  return (
    <div>
      <ToolShell
        inputs={
          <div className="space-y-4">
            <NumberField
              id="gm-formula"
              label="Chemical formula"
              value={formula}
              onChange={setFormula}
              placeholder="CuSO4·5H2O"
              hint="Case matters: Co is cobalt, CO is carbon monoxide. Use ( ) or [ ], and · or * for hydrates."
              inputMode="text"
            />
            <Tabs value={direction} onValueChange={(v) => setDirection(v as Direction)}>
              <TabsList className="w-full">
                <TabsTrigger value="to-moles" className="flex-1">
                  Grams → moles
                </TabsTrigger>
                <TabsTrigger value="to-grams" className="flex-1">
                  Moles → grams
                </TabsTrigger>
              </TabsList>
              <TabsContent value="to-moles">
                <NumberField id="gm-grams" label="Mass" value={amount['to-moles']} onChange={(v) => setAmount((p) => ({ ...p, 'to-moles': v }))} suffix="g" />
              </TabsContent>
              <TabsContent value="to-grams">
                <NumberField id="gm-moles" label="Amount" value={amount['to-grams']} onChange={(v) => setAmount((p) => ({ ...p, 'to-grams': v }))} suffix="mol" />
              </TabsContent>
            </Tabs>
          </div>
        }
        result={
          error || !mm.ok ? (
            <ResultMessage>{error}</ResultMessage>
          ) : toMoles?.ok ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultValue label="Moles" value={`${fmt(toMoles.value.moles)} mol`} />
                <ResultStat label="Particles" value={toMoles.value.particles.toExponential(3).replace('e+', ' × 10^')} />
              </div>
              <ResultStat label="Molar mass" value={`${mm.value.value.toFixed(3)} g/mol`} />
              <StepsList steps={toMoles.value.steps} />
            </>
          ) : toGrams?.ok ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultValue label="Mass" value={`${fmt(toGrams.value.grams)} g`} />
                <ResultStat label="Molar mass" value={`${mm.value.value.toFixed(3)} g/mol`} />
              </div>
              <StepsList steps={toGrams.value.steps} />
            </>
          ) : null
        }
      />

      {mm.ok && (
        <section className="mt-8 max-w-3xl" aria-labelledby="mm-heading">
          <h2 id="mm-heading" className="mb-3 text-xl font-semibold text-ink">
            Molar mass of {formula.replace(/\s+/g, '')}
          </h2>
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="figures w-full text-sm">
              <thead className="border-b border-line bg-surface-muted text-left">
                <tr>
                  <th className="px-3 py-2 font-medium text-ink-muted">Element</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Atoms</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Atomic mass</th>
                  <th className="px-3 py-2 text-right font-medium text-ink-muted">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {mm.value.breakdown.map((b) => (
                  <tr key={b.element} className="border-b border-line last:border-0">
                    <td className="px-3 py-2 text-ink">{b.element}</td>
                    <td className="px-3 py-2 text-right text-ink">{b.count}</td>
                    <td className="px-3 py-2 text-right text-ink">{b.atomicMass}</td>
                    <td className="px-3 py-2 text-right text-ink">{b.subtotal.toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="bg-surface-muted font-semibold">
                  <td className="px-3 py-2 text-ink" colSpan={3}>
                    Total (g/mol)
                  </td>
                  <td className="px-3 py-2 text-right text-ink">{mm.value.value.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">Atomic masses: IUPAC abridged standard atomic weights.</p>
        </section>
      )}
    </div>
  )
}
