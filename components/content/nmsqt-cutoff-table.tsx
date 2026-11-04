import { NMSQT } from '@/lib/data/nmsqt'

const checked = new Date(`${NMSQT.lastChecked}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** Past Semifinalist cutoffs from data/test-prep/nmsqt-cutoffs.json, with year, sources and check date. */
export function NmsqtCutoffTable() {
  return (
    <div className="mb-4">
      <p className="text-ink-muted mb-4 leading-relaxed">
        Class of {NMSQT.classOf} (October {NMSQT.testYear} PSAT/NMSQT). Commended cutoff: <strong className="text-ink">{NMSQT.commended}</strong>.{' '}
        {NMSQT.note} Last checked {checked}.
      </p>
      <div className="rounded-card border-line mb-3 overflow-x-auto border">
        <table className="figures w-full text-sm">
          <thead className="border-line bg-surface-muted border-b text-left">
            <tr>
              <th className="text-ink-muted px-3 py-2 font-medium">State</th>
              <th className="text-ink-muted px-3 py-2 text-right font-medium">Class of {NMSQT.classOf} cutoff</th>
            </tr>
          </thead>
          <tbody>
            {NMSQT.cutoffs.map((c) => (
              <tr key={c.state} className="border-line border-b last:border-b-0">
                <td className="px-3 py-1.5">{c.state}</td>
                <td className="px-3 py-1.5 text-right">{c.index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ink-subtle text-xs">
        Sources:{' '}
        {NMSQT.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && '; '}
            <a href={s.url} className="text-accent underline underline-offset-2" rel="noopener">
              {s.label}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  )
}
