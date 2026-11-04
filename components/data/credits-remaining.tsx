'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { ResultMessage, ResultStat, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { creditsRemaining } from '@/lib/credits/remaining'
import type { GraduationPlan } from '@/lib/data/schema'
import { parseNumberInput } from '@/lib/input'

const ELECTIVES = 'electives'

/** "How many credits do I have left?" for one state's diploma plans, per subject and in total. */
export function CreditsRemaining({ plans }: { plans: Pick<GraduationPlan, 'name' | 'totalCredits' | 'subjects'>[] }) {
  const [planIndex, setPlanIndex] = React.useState(0)
  const [earned, setEarned] = React.useState<Record<string, string>>({})
  const plan = plans[planIndex]
  const fields = [...plan.subjects.map((s) => ({ key: s.key, label: s.label })), { key: ELECTIVES, label: 'Electives and other credits' }]

  const parsed = fields.map((f) => {
    const raw = earned[f.key] ?? ''
    if (raw.trim() === '') return { ...f, value: 0 }
    const p = parseNumberInput(raw)
    if (!p.ok) return { ...f, error: p.error }
    if (p.value < 0) return { ...f, error: 'Enter 0 or more.' }
    return { ...f, value: p.value }
  })
  const firstError = parsed.find((p) => 'error' in p)
  const anyEntered = fields.some((f) => (earned[f.key] ?? '').trim() !== '')
  const result =
    firstError || !anyEntered
      ? null
      : creditsRemaining(plan, Object.fromEntries(parsed.map((p) => [p.key, 'value' in p ? (p.value ?? 0) : 0])))

  return (
    <ToolShell
      inputs={
        <div className="space-y-4">
          {plans.length > 1 && (
            <div>
              <label htmlFor="cr-plan" className="mb-1 block text-sm font-medium text-ink">
                Diploma plan
              </label>
              <NativeSelect id="cr-plan" value={planIndex} onChange={(e) => setPlanIndex(Number(e.target.value))}>
                {plans.map((p, i) => (
                  <option key={p.name} value={i}>
                    {p.name} ({p.totalCredits} credits)
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Credits you have earned so far</legend>
            <ul className="space-y-2">
              {parsed.map((f) => (
                <li key={f.key} className="grid grid-cols-[1fr_6rem] items-center gap-3">
                  <label htmlFor={`cr-${f.key}`} className="text-sm text-ink-muted">
                    {f.label}
                  </label>
                  <Input
                    id={`cr-${f.key}`}
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    className="figures"
                    aria-invalid={'error' in f || undefined}
                    value={earned[f.key] ?? ''}
                    onChange={(e) => setEarned((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      }
      result={
        firstError && 'error' in firstError ? (
          <ResultMessage>
            {firstError.label}: {firstError.error}
          </ResultMessage>
        ) : result === null ? (
          <ResultMessage>Enter the credits you have earned in each subject (half credits like 0.5 are fine).</ResultMessage>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ResultValue
                label="Credits left to graduate"
                value={String(result.totalRemaining)}
                hint={`of ${result.totalRequired} for the ${plan.name}`}
              />
              <ResultStat label="Counted so far" value={String(result.totalEarned)} />
            </div>
            <table className="figures mt-5 w-full text-sm">
              <thead className="text-left text-ink-muted">
                <tr>
                  <th className="py-1 pr-2 font-medium font-sans">Subject</th>
                  <th className="py-1 pr-2 font-medium font-sans">Need</th>
                  <th className="py-1 font-medium font-sans">Left</th>
                </tr>
              </thead>
              <tbody>
                {result.bySubject.map((s) => (
                  <tr key={s.key} className="border-t border-line">
                    <td className="py-1 pr-2 font-sans text-ink">{s.label}</td>
                    <td className="py-1 pr-2">{s.required}</td>
                    <td className={s.remaining > 0 ? 'py-1 font-semibold text-ink' : 'py-1 text-ink-subtle'}>
                      {s.remaining > 0 ? s.remaining : 'Done'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-ink-subtle">
              Extra credits in a subject count toward the total as electives, but can&apos;t replace a required
              subject.
            </p>
          </>
        )
      }
    />
  )
}
