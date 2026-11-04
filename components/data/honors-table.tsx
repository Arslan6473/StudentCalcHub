import type { College } from '@/lib/data/schema'

const cell = (n?: number) => (n === undefined ? '—' : n.toString())

/** One row per school inside a university, with any extra requirements. */
export function HonorsTable({ college }: { college: College }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="figures w-full text-sm">
        <thead className="border-b border-line bg-surface-muted text-left">
          <tr>
            <th className="px-3 py-2 font-medium text-ink-muted">School</th>
            <th className="px-3 py-2 font-medium text-ink-muted">Cum laude</th>
            <th className="px-3 py-2 font-medium text-ink-muted">Magna</th>
            <th className="px-3 py-2 font-medium text-ink-muted">Summa</th>
          </tr>
        </thead>
        <tbody>
          {college.honors.schools.map((s) => (
            <tr key={s.name} className="border-b border-line align-top last:border-b-0">
              <td className="px-3 py-2 font-sans text-ink">
                <span className="font-medium">{s.name}</span>
                {s.extraRequirements.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-ink-muted">
                    {s.extraRequirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="px-3 py-2">{cell(s.cumLaude)}</td>
              <td className="px-3 py-2">{cell(s.magnaCumLaude)}</td>
              <td className="px-3 py-2">{cell(s.summaCumLaude)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
