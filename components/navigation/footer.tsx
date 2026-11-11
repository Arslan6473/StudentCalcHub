import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

import { BLOG, BLOG_CATEGORIES } from '@/config/blog'
import { HUBS, HUB_EXTRA_LINKS } from '@/config/hubs'
import { FOOTER_LEGAL_LINKS, SITE } from '@/config/site'

const linkClass = 'text-ink-muted transition-colors hover:text-ink'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-ink">
              <GraduationCap className="size-4.5" aria-hidden />
            </span>
            {SITE.name}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            {SITE.tagline} Free for students everywhere — no sign-up, and every calculation runs in your browser.
          </p>
        </div>

        <FooterColumn title="Tool hubs" links={HUBS.map((hub) => ({ label: hub.name, href: hub.href }))} />
        <FooterColumn
          title={BLOG.name}
          links={[
            { label: 'All guides', href: BLOG.href },
            ...BLOG_CATEGORIES.map((c) => ({ label: c.name, href: `${BLOG.href}/category/${c.slug}` })),
          ]}
        />
        <FooterColumn title="US college & school data" links={HUB_EXTRA_LINKS.gpa} />
        <FooterColumn title="About & legal" links={[...FOOTER_LEGAL_LINKS]} />
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

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
