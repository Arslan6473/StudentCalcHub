import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getCollege, getColleges } from '@/lib/data/colleges'
import { collegeIntro } from '@/lib/data/college-intro'
import { toCheckerCollege } from '@/lib/data/checker-colleges'
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schema'
import { formatPoints } from '@/lib/gpa/scale'
import { AdSlot } from '@/components/ads/ad-slot'
import { EditorialByline } from '@/components/content/editorial-byline'
import { CollegeHonorsChecker } from '@/components/data/college-honors-checker'
import { HonorsTable } from '@/components/data/honors-table'
import { TermGpa } from '@/components/data/term-gpa'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { LearningNote } from '@/components/tools/learning-note'
import { RelatedTools } from '@/components/tools/related-tools'
import { SourcesList } from '@/components/tools/sources-list'

export const dynamicParams = false

export function generateStaticParams() {
  return getColleges().map((c) => ({ college: c.slug }))
}

function title(shortName: string) {
  return `${shortName} GPA Scale & Latin Honors Requirements`
}

export async function generateMetadata({ params }: PageProps<'/gpa/college/[college]'>): Promise<Metadata> {
  const college = getCollege((await params).college)
  if (!college) return {}
  const description = `${college.shortName} grade-point scale, a term GPA calculator on that scale, and cum laude, magna and summa cum laude GPA cutoffs — from official sources.`
  return {
    title: title(college.shortName),
    description: description.slice(0, 160),
    alternates: { canonical: `/gpa/college/${college.slug}` },
  }
}

function relatedColleges(slug: string, state: string) {
  const others = getColleges().filter((c) => c.slug !== slug)
  const sameState = others.filter((c) => c.state === state)
  const picks = [...sameState, ...others.filter((c) => c.state !== state)].slice(0, Math.max(3, sameState.length))
  return picks.map((c) => ({ label: `${c.shortName} GPA scale & Latin honors`, href: `/gpa/college/${c.slug}` }))
}

export default async function Page({ params }: PageProps<'/gpa/college/[college]'>) {
  const college = getCollege((await params).college)
  if (!college) notFound()
  const path = `/gpa/college/${college.slug}`
  const breadcrumbItems = [
    { label: 'GPA & Graduation', href: '/gpa' },
    { label: 'Latin Honors', href: '/gpa/latin-honors' },
    { label: college.shortName, href: path },
  ]
  const { honors } = college

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        data={webPageSchema({ name: title(college.shortName), description: collegeIntro(college), url: path, dateModified: college.lastChecked })}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{title(college.shortName)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{collegeIntro(college)}</p>
        <EditorialByline updated={college.lastChecked} />
      </header>

      <div className="max-w-3xl space-y-10">
        <section aria-labelledby="scale-heading">
          <h2 id="scale-heading" className="mb-3 text-2xl font-semibold text-ink">
            {college.shortName} grade-point scale
          </h2>
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="figures w-full text-sm">
              <thead className="border-b border-line bg-surface-muted text-left">
                <tr>
                  <th className="px-3 py-2 font-medium text-ink-muted">Grade</th>
                  <th className="px-3 py-2 font-medium text-ink-muted">Grade points</th>
                </tr>
              </thead>
              <tbody>
                {college.scale.map((row) => (
                  <tr key={row.letter} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 font-medium text-ink">{row.letter}</td>
                    <td className="px-3 py-2">{formatPoints(row.points)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(college.scaleNotes.length > 0 || college.nonGpaGrades.length > 0) && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {college.scaleNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              {college.nonGpaGrades.length > 0 && (
                <li>Not counted in GPA: {college.nonGpaGrades.join(', ')}.</li>
              )}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="term-gpa-heading" className="mt-10">
        <h2 id="term-gpa-heading" className="mb-3 text-2xl font-semibold text-ink">
          {college.shortName} term GPA calculator
        </h2>
        <TermGpa scale={college.scale} nonGpaGrades={college.nonGpaGrades} />
        <LearningNote />
        <AdSlot placement="after-result" />
      </section>

      <div className="mt-10 max-w-3xl space-y-10">
        <section aria-labelledby="honors-heading">
          <h2 id="honors-heading" className="mb-3 text-2xl font-semibold text-ink">
            {college.shortName} Latin honors GPA requirements
          </h2>
          <p className="mb-4 text-ink-muted">{honors.rule}</p>
          {honors.basis === 'percentile' && (
            <p className="mb-4 text-sm text-ink-muted">
              Based on {honors.academicYear} cutoffs; next year&apos;s may differ.
            </p>
          )}
          <HonorsTable college={college} />
        </section>
      </div>

      <section aria-labelledby="qualify-heading" className="mt-10">
        <h2 id="qualify-heading" className="mb-3 text-2xl font-semibold text-ink">
          Do I qualify for Latin honors at {college.shortName}?
        </h2>
        <CollegeHonorsChecker colleges={[toCheckerCollege(college)]} />
      </section>

      <div className="mt-10 max-w-3xl space-y-10">
        <AdSlot placement="in-content" />
        {college.deansList && (
          <section aria-labelledby="deans-heading">
            <h2 id="deans-heading" className="mb-3 text-2xl font-semibold text-ink">
              Dean&apos;s list
            </h2>
            <p className="text-ink-muted">{college.deansList}</p>
          </section>
        )}
        <SourcesList sources={college.sources} lastChecked={college.lastChecked} />
        <RelatedTools title="Other colleges" links={relatedColleges(college.slug, college.state)} />
        <AdSlot placement="end-of-page" />
      </div>
    </div>
  )
}
