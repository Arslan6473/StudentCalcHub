import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** The site's one card link: tools, data pages, hubs and guides all render through it. */
export function LinkCard({
  href,
  label,
  summary,
  icon,
  eyebrow,
  meta,
  className,
}: {
  href: string
  label: string
  summary?: string
  icon?: ReactNode
  /** Small line above the label, e.g. a hub or category name. */
  eyebrow?: string
  /** Small line under the summary, e.g. reading time. */
  meta?: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full gap-3 rounded-card border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        {eyebrow && <span className="mb-1 text-xs font-semibold tracking-wide text-accent uppercase">{eyebrow}</span>}
        <span className="flex items-start justify-between gap-2 font-medium text-ink">
          {label}
          <ArrowRight
            className="mt-0.5 size-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden
          />
        </span>
        {summary && <span className="mt-1 block text-sm text-ink-muted">{summary}</span>}
        {meta && <span className="mt-auto pt-3 text-xs text-ink-subtle">{meta}</span>}
      </span>
    </Link>
  )
}
