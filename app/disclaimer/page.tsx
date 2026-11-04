import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `${SITE.name} results are for learning and checking, not official. Here's what that means.`,
  alternates: { canonical: '/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <ProsePage title="Disclaimer" href="/disclaimer" updated="November 4, 2026">
      <p>
        {SITE.name} is an independent educational website. Its calculators and data pages are for
        learning and for checking your own work. They are <strong>not official</strong>.
      </p>

      <h2>GPA, honors, and graduation data</h2>
      <p>
        College GPA scales, Latin honors cutoffs, and state graduation requirements come from
        official pages, with the date they were last checked. Rules change, schools have
        exceptions, and districts often require more credits than the state minimum. Always confirm
        with your registrar, academic advisor, or school counselor before relying on a result.
      </p>

      <h2>Test score estimates</h2>
      <p>
        SAT, PSAT/NMSQT, and ACT results are estimates. Official scores depend on the test form and
        are set only by College Board or ACT. National Merit cutoffs shown are past cutoffs and are
        not a prediction for your year.
      </p>

      <h2>Chemistry and statistics</h2>
      <p>
        Calculations follow standard textbook methods. Your teacher or course may use different
        rounding rules or constants — follow their instructions.
      </p>

      <h2>No affiliation</h2>
      <p>
        {SITE.name} is not affiliated with any college, school district, state agency, College
        Board, ACT, or the National Merit Scholarship Corporation. Names are used only to identify
        whose published rules a page describes.
      </p>

      <p>
        Found something wrong? <Link href="/contact">Let us know</Link>.
      </p>
    </ProsePage>
  )
}
