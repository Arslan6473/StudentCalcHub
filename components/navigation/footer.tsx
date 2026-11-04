import Link from 'next/link'

import { HUBS, HUB_EXTRA_LINKS } from '@/config/hubs'
import { FOOTER_LEGAL_LINKS, SITE } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">Tool hubs</h2>
          <ul className="space-y-2 text-sm">
            {HUBS.map((hub) => (
              <li key={hub.slug}>
                <Link href={hub.href} className="text-ink-muted hover:text-ink">
                  {hub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">GPA & graduation data</h2>
          <ul className="space-y-2 text-sm">
            {HUB_EXTRA_LINKS.gpa.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink">About & legal</h2>
          <ul className="space-y-2 text-sm">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page border-t border-line py-6 text-xs text-ink-subtle">
        <p className="max-w-3xl">
          {SITE.disclaimerShort}{' '}
          <Link href="/disclaimer" className="underline hover:text-ink-muted">
            Read the full disclaimer
          </Link>
          .
        </p>
        <p className="mt-3">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
