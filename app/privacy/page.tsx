import type { Metadata } from 'next'

import { CONTACT_EMAIL, SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `What ${SITE.name} collects (very little), how analytics and advertising work, and your choices.`,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy Policy" href="/privacy" updated="November 4, 2026">
      <h2>Your calculations stay on your device</h2>
      <p>
        Every calculator on {SITE.name} runs in your browser. Grades, scores, credits, and lab
        values you type are never sent to our servers or stored by us. There are no accounts and no
        sign-ups.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Vercel Web Analytics to count page views. It does not use cookies and does not build
        a profile of individual visitors. It records things like the page visited, the referring
        site, and a rough country, in aggregate.
      </p>

      <h2>Advertising</h2>
      <p>
        {SITE.name} is free because it may show ads from Google AdSense. When ads are enabled,
        Google and its partners may use cookies or similar technologies to show ads based on your
        visits to this and other websites. You can learn more in{' '}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
          how Google uses information from sites that use its services
        </a>
        , and turn off personalized ads in{' '}
        <a href="https://adssettings.google.com" rel="noopener">
          Google Ad Settings
        </a>{' '}
        or at{' '}
        <a href="https://www.aboutads.info/choices" rel="noopener">
          aboutads.info
        </a>
        . Visitors in the EEA, UK, and Switzerland are asked for consent through Google&apos;s
        certified consent tool before personalized ads are shown.
      </p>

      <h2>Theme preference</h2>
      <p>
        If you choose light or dark mode, that choice is saved in your browser&apos;s local storage so
        the site remembers it. Nothing else is stored.
      </p>

      <h2>Contact form</h2>
      <p>
        The contact form opens your own email app with your message filled in. We only see your
        message if you choose to send that email.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The site is meant for high school and college students. We don&apos;t knowingly collect
        personal information from anyone, including children under 13.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </ProsePage>
  )
}
