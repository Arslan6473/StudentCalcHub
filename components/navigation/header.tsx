import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

import { HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { ThemeToggle } from '@/components/navigation/theme-toggle'
import { MobileNav } from '@/components/navigation/mobile-nav'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink">
            <GraduationCap className="size-4.5" />
          </span>
          <span>{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {hub.shortName}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
