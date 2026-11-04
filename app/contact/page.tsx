import type { Metadata } from 'next'

import { CONTACT_EMAIL, SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Report an error, suggest a college or state, or ask a question about ${SITE.name}.`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <ProsePage title="Contact" href="/contact">
      <p>
        Found a cutoff that changed, a state rule that&apos;s out of date, or a calculator bug?
        Want your college or state added? Send a message — a link to the official source helps a
        lot.
      </p>
      <p>
        You can also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
      </p>
      <div className="pt-4">
        <ContactForm />
      </div>
    </ProsePage>
  )
}
