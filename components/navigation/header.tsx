import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

import { BLOG } from '@/config/blog'
import { HUBS } from '@/config/hubs'
import { SITE } from '@/config/site'
import { searchIndex } from '@/lib/search'
import { ThemeToggle } from '@/components/navigation/theme-toggle'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { SiteSearch } from '@/components/search/site-search'

const NAV_LINKS = [...HUBS.map((hub) => ({ label: hub.shortName, href: hub.href })), { label: 'Guides', href: BLOG.href }]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md supports-[backdrop-filter]:bg-surface/75">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink">
            <GraduationCap className="size-4.5" />
          </span>
          <span>{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SiteSearch entries={searchIndex()} variant="icon" />
          <ThemeToggle />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  )
}
