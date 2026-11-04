import type { Metadata } from 'next'
import Link from 'next/link'

import { HUBS } from '@/config/hubs'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="container-page max-w-2xl py-16 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-ink-muted">
        The link may be broken or the page may have moved. Try one of these instead.
      </p>

      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {HUBS.map((hub) => (
          <li key={hub.slug}>
            <Link
              href={hub.href}
              className="block rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium text-ink hover:border-accent"
            >
              {hub.name}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-accent hover:underline">
        Back to the homepage
      </Link>
    </div>
  )
}
