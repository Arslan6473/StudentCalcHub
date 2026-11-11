'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function MobileNav({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-canvas">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-semibold text-ink">Menu</span>
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
          <nav className="flex flex-col p-4" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-surface-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
