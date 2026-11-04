import { QUESTIONS, RESULTS, START_ID } from '@/lib/statistics/test-chooser'

function Node({ id }: { id: string }) {
  const result = RESULTS[id]
  if (result) return <strong className="text-ink">→ {result.test}</strong>
  const q = QUESTIONS[id]
  return (
    <>
      <span className="text-ink">{q.text}</span>
      <ul className="mt-1.5 mb-2 list-disc space-y-1.5 pl-5">
        {q.options.map((o) => (
          <li key={o.label}>
            <em>{o.label}</em> <Node id={o.next} />
          </li>
        ))}
      </ul>
    </>
  )
}

/** The whole chooser tree as a nested list — printable, and built from the same data as the tool. */
export function TestFlowchart() {
  return (
    <div className="mb-4 rounded-card border border-line p-4 text-sm text-ink-muted print:border-0 print:p-0 print:text-black">
      <Node id={START_ID} />
    </div>
  )
}
