import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Info } from 'lucide-react'

import { getState, getStates } from '@/lib/data/states'
import { stateFaqs, stateIntro } from '@/lib/data/state-content'
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/seo/schema'
import { AdSlot } from '@/components/ads/ad-slot'
import { EditorialByline } from '@/components/content/editorial-byline'
import { CreditsRemaining } from '@/components/data/credits-remaining'
import { PlanTable } from '@/components/data/plan-table'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqSection } from '@/components/tools/faq-section'
import { LearningNote } from '@/components/tools/learning-note'
import { RelatedTools } from '@/components/tools/related-tools'
import { SourcesList } from '@/components/tools/sources-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamicParams = false

export function generateStaticParams() {
  return getStates().map((s) => ({ state: s.slug }))
}

function title(name: string, classOf: string) {
  return `How Many Credits to Graduate High School in ${name}? (${classOf})`
}

export async function generateMetadata({ params }: PageProps<'/high-school-credits/[state]'>): Promise<Metadata> {
  const state = getState((await params).state)
  if (!state) return {}
  return {
    title: { absolute: title(state.name, state.appliesToClassOf) },
    description: stateIntro(state).slice(0, 160),
    alternates: { canonical: `/high-school-credits/${state.slug}` },
  }
}

export default async function Page({ params }: PageProps<'/high-school-credits/[state]'>) {
  const state = getState((await params).state)
  if (!state) notFound()
  const path = `/high-school-credits/${state.slug}`
  const heading = title(state.name, state.appliesToClassOf)
  const faqs = stateFaqs(state)
  const breadcrumbItems = [
    { label: 'GPA & Graduation', href: '/gpa' },
    { label: 'High School Credits', href: '/high-school-credits' },
    { label: state.name, href: path },
  ]

  return (
    <div className="container-page py-8">
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={webPageSchema({ name: heading, description: stateIntro(state), url: path, dateModified: state.lastChecked })} />
      <JsonLd data={faqSchema(faqs)} />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{heading}</h1>
        <p className="mt-2 text-lg text-ink-muted">{stateIntro(state)}</p>
        <EditorialByline updated={state.lastChecked} />
      </header>

      <div className="max-w-3xl space-y-10">
        <section aria-labelledby="plans-heading">
          <h2 id="plans-heading" className="mb-3 text-2xl font-semibold text-ink">
            {state.plans.length > 1 ? `${state.name} diploma plans` : `${state.name} credit requirements`}
          </h2>
          {state.plans.length > 1 ? (
            <Tabs defaultValue="0">
              <TabsList className="h-auto flex-wrap">
                {state.plans.map((p, i) => (
                  <TabsTrigger key={p.name} value={String(i)} className="h-auto py-1 whitespace-normal">
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {state.plans.map((p, i) => (
                <TabsContent key={p.name} value={String(i)}>
                  <PlanTable plan={p} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <PlanTable plan={state.plans[0]} />
          )}
        </section>

        {state.otherRequirements.length > 0 && (
          <section aria-labelledby="other-heading">
            <h2 id="other-heading" className="mb-3 text-2xl font-semibold text-ink">
              Other requirements besides credits
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-ink-muted">
              {state.otherRequirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        <aside className="flex items-start gap-3 rounded-card border border-line-strong bg-surface-muted px-4 py-3 text-sm text-ink">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p>
            <strong>Your district may require more.</strong> {state.districtNote}
          </p>
        </aside>
      </div>

      <section aria-labelledby="calc-heading" className="mt-10">
        <h2 id="calc-heading" className="mb-3 text-2xl font-semibold text-ink">
          How many credits do I have left?
        </h2>
        <CreditsRemaining plans={state.plans} />
        <LearningNote />
        <AdSlot placement="after-result" />
      </section>

      <div className="mt-10 max-w-3xl space-y-10">
        <AdSlot placement="in-content" />
        <FaqSection faqs={faqs} />
        <SourcesList sources={state.sources} lastChecked={state.lastChecked} />
        <RelatedTools
          title="Other states"
          links={getStates()
            .filter((s) => s.slug !== state.slug)
            .map((s) => ({ label: `${s.name} graduation credits`, href: `/high-school-credits/${s.slug}` }))}
        />
        <p className="text-sm text-ink-muted">
          Heading to college? See{' '}
          <Link href="/gpa/latin-honors" className="text-accent underline underline-offset-2">
            Latin honors GPA requirements by college
          </Link>
          .
        </p>
        <AdSlot placement="end-of-page" />
      </div>
    </div>
  )
}
