import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms for using ${SITE.name}'s free calculators and data pages.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <ProsePage title="Terms of Service" href="/terms" updated="November 4, 2026">
      <p>By using {SITE.name}, you agree to these terms.</p>

      <h2>For learning and checking</h2>
      <p>
        The tools are provided free for learning and for checking your own work. They are not
        official. Your school, registrar, state education department, or testing agency always has
        the final word. See the <Link href="/disclaimer">disclaimer</Link>.
      </p>

      <h2>Academic honesty</h2>
      <p>
        Follow your school&apos;s academic integrity rules. Don&apos;t submit a calculator&apos;s
        output as your own work where your teacher asks you to show your own working.
      </p>

      <h2>No warranty</h2>
      <p>
        We work hard to keep every formula and data value accurate, but the site is provided “as
        is” without warranties of any kind. We are not liable for decisions made using it.
      </p>

      <h2>Content</h2>
      <p>
        The text, code, and design of {SITE.name} are ours. You may link to any page and quote
        short passages with a link back. Please don&apos;t copy whole pages or data tables.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version.</p>
    </ProsePage>
  )
}
