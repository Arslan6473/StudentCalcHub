import type { Step } from '@/lib/steps'

/** The shown working under a result — the site's main difference from answer-only calculators. */
export function StepsList({ steps, title = 'Step-by-step working' }: { steps: Step[]; title?: string }) {
  if (steps.length === 0) return null
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
      <ol className="space-y-2 text-sm">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="figures flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink-muted">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="font-medium text-ink">{step.label}: </span>
              <span className="figures break-words text-ink-muted">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
