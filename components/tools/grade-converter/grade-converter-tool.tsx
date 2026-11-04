'use client'

import * as React from 'react'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NumberField } from '@/components/tools/number-field'
import { StepsList } from '@/components/tools/steps-list'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { convertGpa, convertLetter, convertPercent, percentRange, type Conversion } from '@/lib/gpa/convert'
import type { Result } from '@/lib/result'
import { STANDARD_SCALE } from '@/lib/gpa/scale'

type Mode = 'percent' | 'letter' | 'gpa'

const MODES: { mode: Mode; tab: string; label: string; placeholder: string; hint: string; convert: (raw: string) => Result<Conversion> }[] = [
  { mode: 'percent', tab: 'From %', label: 'Percentage', placeholder: '89.9', hint: 'Your class grade as a percent.', convert: convertPercent },
  { mode: 'letter', tab: 'From letter', label: 'Letter grade', placeholder: 'B+', hint: 'A+ through F.', convert: convertLetter },
  { mode: 'gpa', tab: 'From GPA', label: 'GPA (unweighted, 0–4.0)', placeholder: '3.5', hint: 'One class or an overall GPA.', convert: convertGpa },
]

export function GradeConverterTool() {
  const [values, setValues] = React.useState<Record<Mode, string>>({ percent: '89.9', letter: 'B+', gpa: '3.5' })

  return (
    <div>
      <Tabs defaultValue="percent">
        <TabsList className="w-full">
          {MODES.map((m) => (
            <TabsTrigger key={m.mode} value={m.mode} className="flex-1">
              {m.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {MODES.map((m) => {
          const result = m.convert(values[m.mode])
          return (
            <TabsContent key={m.mode} value={m.mode}>
              <ToolShell
                inputs={
                  <NumberField
                    id={`grade-${m.mode}`}
                    label={m.label}
                    value={values[m.mode]}
                    onChange={(v) => setValues((prev) => ({ ...prev, [m.mode]: v }))}
                    placeholder={m.placeholder}
                    hint={m.hint}
                    inputMode={m.mode === 'letter' ? 'text' : 'decimal'}
                    suffix={m.mode === 'percent' ? '%' : undefined}
                  />
                }
                result={
                  result.ok ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <ResultValue label="Letter" value={result.value.letter} />
                        <ResultStat label="GPA points" value={result.value.points.toFixed(1)} />
                        <ResultStat label="Usual percent" value={result.value.range} />
                      </div>
                      <StepsList steps={result.value.steps} />
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

      <section className="mt-8 max-w-3xl" aria-labelledby="scale-heading">
        <h2 id="scale-heading" className="mb-3 text-xl font-semibold text-ink">
          Standard 4.0 scale
        </h2>
        <div className="overflow-x-auto rounded-card border border-line">
          <table className="figures w-full text-sm">
            <thead className="border-b border-line bg-surface-muted text-left">
              <tr>
                <th className="px-3 py-2 font-medium text-ink-muted">Letter</th>
                <th className="px-3 py-2 font-medium text-ink-muted">GPA points</th>
                <th className="px-3 py-2 font-medium text-ink-muted">Usual percent</th>
              </tr>
            </thead>
            <tbody>
              {STANDARD_SCALE.map((row) => (
                <tr key={row.letter} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 font-medium text-ink">{row.letter}</td>
                  <td className="px-3 py-2">{row.points.toFixed(1)}</td>
                  <td className="px-3 py-2">{percentRange(row.letter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Schools set their own cutoffs — some start an A at 90%, some count A+ as 4.3, and colleges may use a
          different scale. Check your syllabus or your college&apos;s scale on its{' '}
          <Link href="/gpa/latin-honors" className="text-accent underline underline-offset-2">
            Latin honors and GPA scale page
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
