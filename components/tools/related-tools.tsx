import Link from 'next/link'

export function RelatedTools({
  links,
  title = 'Related tools',
}: {
  links: { label: string; href: string; summary?: string }[]
  title?: string
}) {
  if (links.length === 0) return null
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-4 text-2xl font-semibold text-ink">
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block h-full rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="font-medium text-ink">{link.label}</span>
              {link.summary && <span className="mt-1 block text-sm text-ink-muted">{link.summary}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
