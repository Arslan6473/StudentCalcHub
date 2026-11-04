import type { GraduationPlan } from '@/lib/data/schema'
import { electiveCredits } from '@/lib/data/state-content'

/** One diploma plan's credits by subject, with the electives remainder and the total. */
export function PlanTable({ plan }: { plan: GraduationPlan }) {
  const electives = electiveCredits(plan)
  return (
    <div>
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="figures w-full text-sm">
          <thead className="border-b border-line bg-surface-muted text-left">
            <tr>
              <th className="px-3 py-2 font-sans font-medium text-ink-muted">Subject</th>
              <th className="px-3 py-2 font-sans font-medium text-ink-muted">Credits</th>
            </tr>
          </thead>
          <tbody>
            {plan.subjects.map((s) => (
              <tr key={s.key} className="border-b border-line">
                <td className="px-3 py-2 font-sans text-ink">
                  {s.label}
                  {s.notes && <span className="mt-0.5 block text-xs text-ink-subtle">{s.notes}</span>}
                </td>
                <td className="px-3 py-2 align-top">{s.credits}</td>
              </tr>
            ))}
            {electives > 0 && (
              <tr className="border-b border-line">
                <td className="px-3 py-2 font-sans text-ink">Electives</td>
                <td className="px-3 py-2">{electives}</td>
              </tr>
            )}
            <tr className="bg-surface-muted font-semibold">
              <td className="px-3 py-2 font-sans text-ink">Total</td>
              <td className="px-3 py-2 text-ink">{plan.totalCredits}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {plan.notes && <p className="mt-3 text-sm text-ink-muted">{plan.notes}</p>}
    </div>
  )
}
