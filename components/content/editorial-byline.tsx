import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

import { EDITORIAL } from '@/config/site'
import { formatDate } from '@/lib/format-date'

/**
 * Shown under every tool and data page title so readers can see who is
 * behind the content and when it was last revised — the about page carries
 * the detail.
 */
export function EditorialByline({ updated }: { updated: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-y border-line py-3 text-sm text-ink-muted">
      <ShieldCheck className="size-4 text-accent" aria-hidden />
      <span>
        Written and reviewed by{' '}
        <Link href={EDITORIAL.href} className="font-medium text-ink underline-offset-2 hover:underline">
          {EDITORIAL.name}
        </Link>
      </span>
      <span aria-hidden>·</span>
      <span>
        Updated <time dateTime={updated}>{formatDate(updated)}</time>
      </span>
      <span aria-hidden>·</span>
      <Link href="/disclaimer" className="underline-offset-2 hover:underline">
        For learning — not official
      </Link>
    </div>
  )
}
