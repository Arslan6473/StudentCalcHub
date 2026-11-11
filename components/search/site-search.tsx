'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { CornerDownLeft, Search, X } from 'lucide-react'

import type { SearchEntry } from '@/lib/search'
import { cn } from '@/lib/utils'

const MAX_RESULTS = 12
const GROUP_ORDER: SearchEntry['group'][] = ['Tools', 'Guides', 'Data pages', 'Hubs']

/** Every query word must appear somewhere; label hits rank above keyword-only hits. */
function rank(entries: SearchEntry[], query: string): SearchEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return entries.filter((e) => e.group === 'Tools').slice(0, 8)
  return entries
    .map((entry) => {
      const label = entry.label.toLowerCase()
      const haystack = `${label} ${entry.terms.toLowerCase()}`
      if (!words.every((w) => haystack.includes(w))) return null
      const score = words.filter((w) => label.includes(w)).length * 2 + (label.startsWith(words[0]) ? 1 : 0)
      return { entry, score }
    })
    .filter((r) => r !== null)
    .sort((a, b) => b.score - a.score || GROUP_ORDER.indexOf(a.entry.group) - GROUP_ORDER.indexOf(b.entry.group))
    .slice(0, MAX_RESULTS)
    .map((r) => r.entry)
}

/**
 * Search across tools, guides and data pages. `variant="icon"` is the header
 * button (and owns the Ctrl/⌘+K shortcut); `variant="hero"` is a full-width
 * field-style button for the homepage.
 */
export function SiteSearch({ entries, variant }: { entries: SearchEntry[]; variant: 'icon' | 'hero' }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const results = React.useMemo(() => rank(entries, query), [entries, query])

  React.useEffect(() => {
    if (variant !== 'icon') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant])

  const go = (href: string) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active].href)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
    >
      <Dialog.Trigger asChild>
        {variant === 'icon' ? (
          <button
            type="button"
            aria-label="Search the site"
            className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink lg:w-44 lg:border lg:border-line lg:bg-surface-muted/60"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden lg:inline">Search…</span>
          </button>
        ) : (
          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 rounded-card border border-line-strong bg-surface px-4 text-left text-ink-subtle shadow-sm transition-colors hover:border-accent"
          >
            <Search className="size-5 text-ink-muted" aria-hidden />
            <span className="truncate">Search calculators and guides — try “CGPA” or “sig figs”</span>
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-xl overflow-hidden rounded-card border border-line bg-surface shadow-2xl"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search {entries.length} pages</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={onInputKey}
              placeholder="Search tools, guides, colleges, states…"
              aria-label="Search"
              role="combobox"
              aria-expanded
              aria-controls="site-search-results"
              aria-activedescendant={results[active] ? `search-${active}` : undefined}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle"
            />
            <Dialog.Close className="rounded-md p-1 text-ink-muted hover:bg-surface-muted" aria-label="Close search">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <ul id="site-search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-muted">No matches.</li>}
            {results.map((r, i) => (
              <li
                key={r.href}
                id={`search-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.href)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm',
                  i === active ? 'bg-accent-soft text-ink' : 'text-ink-muted',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-ink-subtle">{r.group}</span>
                </span>
                {i === active && <CornerDownLeft className="size-4 shrink-0 text-accent" aria-hidden />}
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
