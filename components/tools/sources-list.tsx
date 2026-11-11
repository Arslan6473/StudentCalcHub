import { formatDate } from '@/lib/format-date'

/** Official sources for a page, with the date the values were last checked against them. */
export function SourcesList({
  sources,
  lastChecked,
}: {
  sources: { label: string; url: string }[]
  lastChecked?: string
}) {
  if (sources.length === 0) return null
  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="mb-3 text-2xl font-semibold text-ink">
        Sources
      </h2>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} rel="noopener" className="break-words text-accent underline underline-offset-2">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      {lastChecked && (
        <p className="mt-3 text-sm text-ink-subtle">
          Last checked: <time dateTime={lastChecked}>{formatDate(lastChecked)}</time>
        </p>
      )}
    </section>
  )
}
