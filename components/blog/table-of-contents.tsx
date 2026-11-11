import type { PostHeading } from '@/lib/blog/posts'
import { cn } from '@/lib/utils'

export function TableOfContents({ headings, className }: { headings: PostHeading[]; className?: string }) {
  if (headings.length < 3) return null
  return (
    <nav aria-label="On this page" className={cn('rounded-card border border-line bg-surface p-4', className)}>
      <p className="mb-2 text-sm font-semibold text-ink">On this page</p>
      <ol className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'pl-3' : undefined}>
            <a href={`#${h.id}`} className="text-ink-muted hover:text-accent">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
