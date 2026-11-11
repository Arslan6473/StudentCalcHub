import type { Metadata } from 'next'
import Link from 'next/link'

import { CONTACT_EMAIL, EDITORIAL, LEARNING_NOTE, SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'

export const metadata: Metadata = {
  title: 'About',
  description: `Who runs ${SITE.name}, why it exists, and how its formulas and data are checked.`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <ProsePage title={`About ${SITE.name}`} href="/about">
      <p>
        {SITE.name} is a free set of calculators, lookup pages and study guides for high school,
        college and university students around the world. It covers GPA and grade conversion
        between countries, chemistry lab math, statistics, and test-score estimates. A few data
        pages — US college Latin honors and US state graduation credits — are country-specific
        and say so. Every tool shows the steps behind its answer, so you can see how the
        result was reached and check it against your own work.
      </p>

      <h2>Who runs {SITE.name}</h2>
      <p>
        The site is built and maintained by {EDITORIAL.name}, a software developer. Arslan writes the
        calculators and the explanations that go with them, and checks each formula and data value
        against published sources.
      </p>
      <p>
        Arslan is not a teacher, registrar, or testing-agency employee, and the site is not
        connected to any school, College Board, ACT, or National Merit Scholarship Corporation. The
        goal is to explain how standard calculations work and point you to the official rules — not
        to replace them.
      </p>

      <h2>Why this site exists</h2>
      <p>
        Many student calculator pages give one number and no explanation, or bury a simple question
        like “what GPA do I need for magna cum laude?” deep in a school PDF. {SITE.name} puts the
        answer, the working, and the official source on one page.
      </p>
      <p>{LEARNING_NOTE} The site never writes essays, answers homework, or shares test content.</p>

      <h2>How formulas and data are checked</h2>
      <ul>
        <li>
          Formulas follow standard textbook definitions — for example, percent error, molarity, and
          the sample-size formula for a proportion.
        </li>
        <li>
          Every calculation is covered by automated tests against hand-checked answers, including
          edge cases like a blank input or a value of zero.
        </li>
        <li>
          College GPA scales, Latin honors cutoffs, and state graduation credits come only from
          official registrar, catalog, or state education department pages. Each page lists its
          sources and the date the data was last checked. If a value can&apos;t be confirmed from an
          official source, it isn&apos;t published.
        </li>
        <li>
          Test-score tools are clearly labelled as estimates and never copy official conversion
          tables or test questions.
        </li>
      </ul>
      <p>
        The <Link href="/editorial-policy">editorial policy</Link> covers this in more detail.
      </p>

      <h2>Spotted a mistake?</h2>
      <p>
        Rules change every year. If something looks wrong or out of date, please{' '}
        <Link href="/contact">get in touch</Link> or email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a link to the official source.
      </p>
    </ProsePage>
  )
}
