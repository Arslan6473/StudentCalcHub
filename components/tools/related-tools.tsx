import { LinkCard } from '@/components/content/link-card'

export function RelatedTools({
  links,
  title = 'Related tools',
  id = 'related-heading',
}: {
  links: { label: string; href: string; summary?: string }[]
  title?: string
  /** Heading id; pass a distinct one when a page shows more than one list. */
  id?: string
}) {
  if (links.length === 0) return null
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-4 text-2xl font-semibold text-ink">
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <LinkCard href={link.href} label={link.label} summary={link.summary} />
          </li>
        ))}
      </ul>
    </section>
  )
}
