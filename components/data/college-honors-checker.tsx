'use client'

import * as React from 'react'
import Link from 'next/link'

import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { NumberField } from '@/components/tools/number-field'
import { ResultMessage, ResultValue, ToolShell } from '@/components/tools/tool-shell'
import { parseNumberInput } from '@/lib/input'
import { nextHonor, qualifyHonors } from '@/lib/gpa/honors'

export interface CheckerCollege {
  slug: string
  shortName: string
  basis: 'fixed' | 'percentile'
  academicYear?: string
  schools: { name: string; cumLaude?: number; magnaCumLaude?: number; summaCumLaude?: number }[]
}

/**
 * "Do I qualify?" — on a college page it gets one college; on the Latin honors
 * overview it gets them all and shows a college picker.
 */
export function CollegeHonorsChecker({ colleges }: { colleges: CheckerCollege[] }) {
  const [slug, setSlug] = React.useState(colleges[0]?.slug ?? '')
  const [schoolIndex, setSchoolIndex] = React.useState(0)
  const [gpa, setGpa] = React.useState('3.7')

  const college = colleges.find((c) => c.slug === slug) ?? colleges[0]
  if (!college) return null
  const school = college.schools[schoolIndex] ?? college.schools[0]
  const parsed = parseNumberInput(gpa)
  const error = !parsed.ok ? parsed.error : parsed.value < 0 || parsed.value > 4.3 ? 'Enter a GPA between 0 and 4.3.' : null

  return (
    <ToolShell
      inputs={
        <>
          {colleges.length > 1 && (
            <div className="space-y-1.5">
              <Label htmlFor="honors-college">College</Label>
              <NativeSelect
                id="honors-college"
                value={college.slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSchoolIndex(0)
                }}
              >
                {colleges.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortName}
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}
          {college.schools.length > 1 && (
            <div className="space-y-1.5">
              <Label htmlFor="honors-school">School or college</Label>
              <NativeSelect id="honors-school" value={schoolIndex} onChange={(e) => setSchoolIndex(Number(e.target.value))}>
                {college.schools.map((s, i) => (
                  <option key={s.name} value={i}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}
          <NumberField id="honors-gpa" label="Your cumulative GPA" value={gpa} onChange={setGpa} placeholder="3.7" error={error} />
        </>
      }
      result={
        error || !parsed.ok ? (
          <ResultMessage>{error}</ResultMessage>
        ) : (
          <HonorsResult gpa={parsed.value} college={college} school={school} showLink={colleges.length > 1} />
        )
      }
    />
  )
}

function HonorsResult({
  gpa,
  college,
  school,
  showLink,
}: {
  gpa: number
  college: CheckerCollege
  school: CheckerCollege['schools'][number]
  showLink: boolean
}) {
  const level = qualifyHonors(gpa, school)
  const next = nextHonor(gpa, school)
  return (
    <div className="space-y-3">
      <ResultValue
        label={`${college.shortName}${college.schools.length > 1 ? ` — ${school.name}` : ''}`}
        value={level ? capitalize(level) : 'Not yet'}
      />
      <p className="text-sm text-ink-muted">
        {level ? `A ${gpa} GPA meets the ${level} cutoff.` : `A ${gpa} GPA is below every Latin honors cutoff.`}{' '}
        {next && `You’d need ${next.cutoff} for ${next.level} — ${next.gap.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')} higher.`}
      </p>
      {college.basis === 'percentile' && (
        <p className="text-xs text-ink-subtle">
          Based on {college.academicYear} cutoffs; next year&apos;s may differ. These cutoffs are set by class rank, not a
          fixed GPA.
        </p>
      )}
      <p className="text-xs text-ink-subtle">Other requirements (units in residence, conduct) may also apply.</p>
      {showLink && (
        <Link href={`/gpa/college/${college.slug}`} className="text-sm text-accent underline underline-offset-2">
          See all {college.shortName} rules
        </Link>
      )}
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
