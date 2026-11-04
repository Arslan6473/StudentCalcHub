import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** The calculator card: inputs on top (or left on wide screens), result directly after. */
export function ToolShell({ inputs, result, className }: { inputs: ReactNode; result: ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-6 rounded-card border border-line-strong bg-surface p-5 shadow-sm lg:grid-cols-2', className)}>
      <div className="space-y-4">{inputs}</div>
      <div className="min-w-0 rounded-card bg-surface-muted p-5" aria-live="polite">
        {result}
      </div>
    </div>
  )
}

/** Shown in the result panel instead of a number when input is missing or invalid. */
export function ResultMessage({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ink-muted">{children}</p>
}

export function ResultValue({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="figures mt-1 text-3xl font-semibold break-words text-accent">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
    </div>
  )
}

export function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="figures mt-1 text-lg font-semibold break-words text-ink">{value}</p>
    </div>
  )
}
