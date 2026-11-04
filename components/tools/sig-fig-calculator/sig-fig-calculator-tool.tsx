'use client'

import * as React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { countSigFigs, parseMeasurement, roundToSigFigs, sigFigArithmetic } from '@/lib/chemistry/sig-figs'
import { parseNumberInput } from '@/lib/input'

type Op = '+' | '-' | '*' | '/'

const OPS: { op: Op; label: string }[] = [
  { op: '+', label: '+ (add)' },
  { op: '-', label: '− (subtract)' },
  { op: '*', label: '× (multiply)' },
  { op: '/', label: '÷ (divide)' },
]

const NOTATION_HINT = 'Decimals, 1.50e3 or 1.50 x 10^3 all work.'

function CountMode() {
  const [value, setValue] = React.useState('0.00450')
  const result = countSigFigs(value)
  return (
    <ToolShell
      inputs={<NumberField id="sf-count" label="Number" value={value} onChange={setValue} placeholder="0.00450" hint={NOTATION_HINT} inputMode="text" />}
      result={
        result.ok ? (
          <>
            <ResultValue label="Significant figures" value={String(result.value.count)} />
            {result.value.ambiguous && (
              <p className="mt-3 rounded-card bg-accent-soft p-3 text-sm text-ink">
                <strong>Ambiguous zeros.</strong> Without a decimal point, the trailing zeros in {value.trim()} may or may not
                have been measured. Write {value.trim()}. or use scientific notation to show exactly how many are significant.
              </p>
            )}
            <StepsList steps={result.value.steps} />
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}

function RoundMode() {
  const [value, setValue] = React.useState('1234')
  const [n, setN] = React.useState('2')
  const parsed = parseMeasurement(value)
  const count = parseNumberInput(n)
  const error =
    parsed === null
      ? 'Enter a number like 1234, 0.0045678 or 1.2e3.'
      : !count.ok || !Number.isInteger(count.value) || count.value < 1 || count.value > 15
        ? 'Choose a whole number of significant figures from 1 to 15.'
        : null
  const rounded = error ? null : roundToSigFigs(parsed!, Number(n))
  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <NumberField id="sf-round-value" label="Number" value={value} onChange={setValue} hint={NOTATION_HINT} inputMode="text" />
          <NumberField id="sf-round-n" label="Significant figures" value={n} onChange={setN} inputMode="numeric" />
        </div>
      }
      result={
        rounded ? (
          <div className="grid grid-cols-2 gap-4">
            <ResultValue label="Rounded" value={rounded.fixed} />
            <ResultStat label="Scientific notation" value={rounded.scientific} />
          </div>
        ) : (
          <ResultMessage>{error}</ResultMessage>
        )
      }
    />
  )
}

function ArithmeticMode() {
  const [a, setA] = React.useState('12.11')
  const [b, setB] = React.useState('0.3')
  const [op, setOp] = React.useState<Op>('+')
  const result = sigFigArithmetic(op, a, b)
  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          <NumberField id="sf-a" label="First number" value={a} onChange={setA} inputMode="text" />
          <div className="space-y-1.5">
            <Label htmlFor="sf-op">Operation</Label>
            <NativeSelect id="sf-op" value={op} onChange={(e) => setOp(e.target.value as Op)}>
              {OPS.map((o) => (
                <option key={o.op} value={o.op}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <NumberField id="sf-b" label="Second number" value={b} onChange={setB} inputMode="text" />
        </div>
      }
      result={
        result.ok ? (
          <>
            <ResultValue label="Answer with correct sig figs" value={result.value.rounded} hint={result.value.rule} />
            <StepsList steps={result.value.steps} />
          </>
        ) : (
          <ResultMessage>{result.error}</ResultMessage>
        )
      }
    />
  )
}

export function SigFigCalculatorTool() {
  return (
    <Tabs defaultValue="count">
      <TabsList className="w-full">
        <TabsTrigger value="count" className="flex-1">
          Count
        </TabsTrigger>
        <TabsTrigger value="round" className="flex-1">
          Round
        </TabsTrigger>
        <TabsTrigger value="arithmetic" className="flex-1">
          Calculate
        </TabsTrigger>
      </TabsList>
      <TabsContent value="count">
        <CountMode />
      </TabsContent>
      <TabsContent value="round">
        <RoundMode />
      </TabsContent>
      <TabsContent value="arithmetic">
        <ArithmeticMode />
      </TabsContent>
    </Tabs>
  )
}
