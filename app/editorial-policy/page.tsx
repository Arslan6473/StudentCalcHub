import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE } from '@/config/site'
import { ProsePage } from '@/components/content/prose-page'

export const metadata: Metadata = {
  title: 'Editorial Policy & Data Sources',
  description: `How ${SITE.name} researches, sources, checks, and corrects its calculators and data pages.`,
  alternates: { canonical: '/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <ProsePage title="Editorial Policy & Data Sources" href="/editorial-policy">
      <p>
        This page explains where the numbers on {SITE.name} come from and what happens when they
        change.
      </p>

      <h2>Official sources only</h2>
      <p>Data values are taken only from the organization that sets the rule:</p>
      <ul>
        <li>College GPA scales and Latin honors: the university registrar, catalog, or bulletin.</li>
        <li>High school graduation credits: the state department of education or state law.</li>
        <li>National Merit cutoffs: National Merit Scholarship Corporation publications, or school reports that cite them.</li>
        <li>Chemistry constants: IUPAC atomic weights and the SI definition of the Avogadro constant.</li>
      </ul>
      <p>
        Forums, other calculator sites, and unsourced blog posts are never used as a source. If a
        value can&apos;t be confirmed from an official page, that college or state is left out
        rather than guessed.
      </p>

      <h2>“Last checked” dates</h2>
      <p>
        Every data page shows its source links and the date the values were last checked against
        them. Records are re-checked at least once a year — Latin honors percentile cutoffs and
        state rules usually change at the start of the school year. The site&apos;s build process
        flags any record that hasn&apos;t been checked in more than 12 months.
      </p>

      <h2>Estimates are labelled</h2>
      <p>
        The SAT, PSAT/NMSQT, and ACT tools are estimators. Official scores depend on the exact test
        form, so these tools give a likely range, explain why, and never copy an official
        conversion table.
      </p>

      <h2>How calculations are tested</h2>
      <p>
        Each calculator&apos;s math lives in small functions with automated tests against
        hand-checked answers, including tricky inputs such as trailing zeros in significant
        figures, chemical formulas with brackets and hydrates, and grades that don&apos;t count
        toward GPA.
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error, please <Link href="/contact">contact us</Link> with a link to the
        official source. Confirmed errors are fixed and the page&apos;s date is updated.
      </p>
    </ProsePage>
  )
}
