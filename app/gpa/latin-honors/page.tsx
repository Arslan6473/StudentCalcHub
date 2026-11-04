import Link from 'next/link'
import type { Metadata } from 'next'

import { getColleges } from '@/lib/data/colleges'
import { toCheckerCollege } from '@/lib/data/checker-colleges'
import type { College } from '@/lib/data/schema'
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/seo/schema'
import { AdSlot } from '@/components/ads/ad-slot'
import { EditorialByline } from '@/components/content/editorial-byline'
import { CollegeHonorsChecker } from '@/components/data/college-honors-checker'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqSection } from '@/components/tools/faq-section'
import { LearningNote } from '@/components/tools/learning-note'
import { RelatedTools } from '@/components/tools/related-tools'

const PATH = '/gpa/latin-honors'
const TITLE = 'Latin Honors GPA Requirements by College'
const DESCRIPTION =
  'Cum laude, magna cum laude and summa cum laude GPA cutoffs compared across US colleges, from official sources — plus a "do I qualify?" checker.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
}

const FAQS = [
  {
    question: 'What GPA do you need for cum laude?',
    answer:
      'It depends on the college. Fixed cutoffs for cum laude usually fall between about 3.5 and 3.7, while colleges that use class rank set the cutoff each year from the GPAs of that year’s graduates. Check your own college’s row in the table.',
  },
  {
    question: 'What is the difference between cum laude, magna cum laude and summa cum laude?',
    answer:
      'They are three levels of graduation honors. Cum laude means “with praise,” magna cum laude “with great praise,” and summa cum laude “with highest praise.” Each needs a higher cumulative GPA than the one before it.',
  },
  {
    question: 'What does it mean when Latin honors are percentile-based?',
    answer:
      'The college gives honors to a set share of each graduating class, such as the top 5%, 10% and 15%. The GPA you need changes every year because it depends on how everyone else did, so the cutoffs shown are the latest published ones, not a promise.',
  },
  {
    question: 'Do transfer credits count toward Latin honors?',
    answer:
      'Usually only grades earned at the college that awards the degree count toward the honors GPA, and many colleges also require a minimum number of units taken there. Each college page lists the extra requirements it publishes.',
  },
  {
    question: 'Is Latin honors the same as the honors program or departmental honors?',
    answer:
      'No. Latin honors are based on your overall GPA at graduation. An honors program or departmental honors usually needs extra coursework or a thesis, and can be earned along with Latin honors or without them.',
  },
]

function cutoffText(c: College, key: 'cumLaude' | 'magnaCumLaude' | 'summaCumLaude') {
  if (c.honors.schools.length > 1) return 'varies by school'
  return c.honors.schools[0][key]?.toString() ?? '—'
}

export default function Page() {
  const colleges = getColleges()
  const breadcrumbItems = [
    { label: 'GPA & Graduation', href: '/gpa' },
    { label: 'Latin Honors', href: PATH },
  ]
  const updated = colleges.reduce((max, c) => (c.lastChecked > max ? c.lastChecked : max), '2026-11-04')

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={webPageSchema({ name: TITLE, description: DESCRIPTION, url: PATH, dateModified: updated })} />
      <JsonLd data={faqSchema(FAQS)} />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{TITLE}</h1>
        <p className="mt-2 text-lg text-ink-muted">
          The GPA you need for cum laude, magna cum laude and summa cum laude at {colleges.length} US colleges, taken from
          each college&apos;s own registrar or catalog.
        </p>
        <EditorialByline updated={updated} />
      </header>

      <section aria-labelledby="checker-heading">
        <h2 id="checker-heading" className="mb-3 text-2xl font-semibold text-ink">
          Do I qualify?
        </h2>
        <CollegeHonorsChecker colleges={colleges.map(toCheckerCollege)} />
        <LearningNote />
        <AdSlot placement="after-result" />
      </section>

      <div className="mt-10 max-w-3xl space-y-10">
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="mb-3 text-2xl font-semibold text-ink">
            Latin honors cutoffs compared
          </h2>
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="figures w-full text-sm">
              <thead className="border-b border-line bg-surface-muted text-left">
                <tr>
                  <th className="px-3 py-2 font-medium text-ink-muted">College</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Cum laude</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Magna</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Summa</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Basis</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((c) => (
                  <tr key={c.slug} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 font-sans">
                      <Link href={`/gpa/college/${c.slug}`} className="font-medium text-accent underline underline-offset-2">
                        {c.shortName}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{cutoffText(c, 'cumLaude')}</td>
                    <td className="px-3 py-2">{cutoffText(c, 'magnaCumLaude')}</td>
                    <td className="px-3 py-2">{cutoffText(c, 'summaCumLaude')}</td>
                    <td className="px-3 py-2 font-sans text-ink-muted">
                      {c.honors.basis === 'percentile' ? `Class rank (${c.honors.academicYear})` : 'Fixed GPA'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-subtle">
            “Varies by school” means each school or college inside the university sets its own cutoffs — open the
            college page to see them all.
          </p>
        </section>

        <section aria-labelledby="explain-heading" className="space-y-4 text-ink-muted">
          <h2 id="explain-heading" className="text-2xl font-semibold text-ink">
            How Latin honors work
          </h2>
          <p>
            Latin honors are awards printed on your diploma or transcript when you graduate with a high cumulative GPA.
            There are three levels: <strong className="text-ink">cum laude</strong> (with praise),{' '}
            <strong className="text-ink">magna cum laude</strong> (with great praise) and{' '}
            <strong className="text-ink">summa cum laude</strong> (with highest praise). Some colleges award only one
            or two of them.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-ink">Fixed GPA cutoffs</h3>
          <p>
            Most colleges publish a fixed GPA for each level, such as 3.5, 3.7 and 3.9. If your final GPA meets the
            number, you get the honor, no matter how many classmates also do.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-ink">Percentile (class rank) cutoffs</h3>
          <p>
            Other colleges give honors to a fixed share of each graduating class — for example, the top 5%, 10% and
            15%. The GPA needed is worked out each year from the actual GPAs of that year&apos;s graduates, so it moves
            a little every year. For these colleges we show the latest published year and label it.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-ink">Extra requirements</h3>
          <p>
            Many colleges only count grades earned at that college and require a minimum number of units taken there.
            Some also exclude students with conduct violations. These rules are listed on each college page.
          </p>
        </section>

        <AdSlot placement="in-content" />
        <FaqSection faqs={FAQS} />
        <RelatedTools
          links={[
            { label: 'Letter Grade to GPA & Percentage Converter', href: '/gpa/grade-converter' },
            { label: 'High School Credits to Graduate by State', href: '/high-school-credits' },
          ]}
        />
        <AdSlot placement="end-of-page" />
      </div>
    </div>
  )
}
