import { Breadcrumbs } from '@/components/seo/breadcrumbs'

/** Shared frame for the site's text pages (about, policies, legal). */
export function ProsePage({
  title,
  href,
  updated,
  children,
}: {
  title: string
  href: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <div className="container-page max-w-2xl py-8">
      <Breadcrumbs items={[{ label: title, href }]} />
      <h1 className="mb-2 text-3xl font-bold text-ink">{title}</h1>
      {updated && <p className="mb-6 text-sm text-ink-subtle">Last updated {updated}</p>}
      <div className="space-y-4 text-ink-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  )
}
