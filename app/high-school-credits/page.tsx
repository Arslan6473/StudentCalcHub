import Link from 'next/link'
import type { Metadata } from 'next'

import { getStates } from '@/lib/data/states'
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schema'
import { AdSlot } from '@/components/ads/ad-slot'
import { EditorialByline } from '@/components/content/editorial-byline'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'

const PATH = '/high-school-credits'
const TITLE = 'High School Graduation Credits by State'
const DESCRIPTION =
  'How many credits you need to graduate high school in each state, by diploma plan and subject — state minimums from official education department sources.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
}

export default function Page() {
  const states = getStates()
  const breadcrumbItems = [
    { label: 'GPA & Grades', href: '/gpa' },
    { label: 'High School Credits', href: PATH },
  ]
  const updated = states.reduce((max, s) => (s.lastChecked > max ? s.lastChecked : max), '')

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={webPageSchema({ name: TITLE, description: DESCRIPTION, url: PATH, dateModified: updated })} />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{TITLE}</h1>
        <p className="mt-2 text-lg text-ink-muted">
          The minimum credits each state requires to earn a high school diploma, for the current graduating classes.
          Pick your state to see the subjects, every diploma option, and a calculator for the credits you have left.
        </p>
        {updated && <EditorialByline updated={updated} />}
      </header>

      <div className="max-w-3xl space-y-10">
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="mb-3 text-2xl font-semibold text-ink">
            Credits to graduate, state by state
          </h2>
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="figures w-full text-sm">
              <thead className="border-b border-line bg-surface-muted text-left">
                <tr>
                  <th className="px-3 py-2 font-sans font-medium text-ink-muted">State</th>
                  <th className="px-3 py-2 font-sans font-medium text-ink-muted">Diploma plan</th>
                  <th className="px-3 py-2 font-sans font-medium text-ink-muted">Credits</th>
                </tr>
              </thead>
              <tbody>
                {states.flatMap((s) =>
                  s.plans.map((p, i) => (
                    <tr key={`${s.slug}-${p.name}`} className={i === s.plans.length - 1 ? 'border-b border-line' : ''}>
                      {i === 0 && (
                        <td rowSpan={s.plans.length} className="px-3 py-2 align-top font-sans">
                          <Link href={`${PATH}/${s.slug}`} className="font-medium text-accent underline underline-offset-2">
                            {s.name}
                          </Link>
                          <span className="block text-xs text-ink-subtle">Class of {s.appliesToClassOf}</span>
                        </td>
                      )}
                      <td className="px-3 py-2 font-sans text-ink-muted">{p.name}</td>
                      <td className="px-3 py-2">{p.totalCredits}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>

        <AdSlot placement="in-content" />

        <section aria-labelledby="explain-heading" className="space-y-4 text-ink-muted">
          <h2 id="explain-heading" className="text-2xl font-semibold text-ink">
            How high school credits work
          </h2>
          <p>
            In most states, one credit means passing a class that meets all year (often called a Carnegie unit). A
            one-semester class is usually worth half a credit. States set a minimum number of credits and say how many
            must come from English, math, science, social studies and other subjects; the rest are electives you
            choose.
          </p>
          <p>
            These are <strong className="text-ink">state minimums</strong>. School districts can — and often do — ask
            for more credits, extra courses or community service. Your school counselor or student handbook has the
            exact rules for your school.
          </p>
          <p>
            Some states also have more than one diploma, such as a standard diploma and an advanced or honors one that
            needs more math, science or a world language. Colleges look at the courses you took, so the harder plan can
            help with admissions.
          </p>
        </section>

        <AdSlot placement="end-of-page" />
      </div>
    </div>
  )
}
