import { Badge } from '@/components/ui/badge'
import type { ScoreRange } from '@/lib/test-prep/curve'
import { parseNumberInput } from '@/lib/input'
import type { Result } from '@/lib/result'

/** One estimated score: the middle value, an "Estimate" badge, and the likely range. */
export function ScoreEstimate({ label, range, size = 'stat' }: { label: string; range: ScoreRange; size?: 'value' | 'stat' }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-medium text-ink-muted">
        {label} <Badge variant="outline">Estimate</Badge>
      </p>
      <p className={size === 'value' ? 'figures mt-1 text-3xl font-semibold text-accent' : 'figures mt-1 text-lg font-semibold text-ink'}>
        {range.mid}
      </p>
      <p className="figures text-xs text-ink-subtle">
        likely {range.low}–{range.high}
      </p>
    </div>
  )
}

export function EstimateNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-card bg-accent-soft p-3 text-sm text-ink">{children}</p>
}

/** A correct-answer count from a text box; whole-number and range checks happen in the estimator. */
export function countField(label: string, raw: string): Result<number> {
  const p = parseNumberInput(raw)
  return p.ok ? p : { ok: false, error: `${label}: ${p.error}` }
}
