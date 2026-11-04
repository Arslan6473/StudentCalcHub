import { CONTACT_EMAIL, EDITORIAL, SITE } from '@/config/site'

/**
 * JSON-LD builders. Pure functions returning plain objects — the `<JsonLd>`
 * component only serializes. Only schema that accurately represents visible
 * page content: no ratings, no reviews.
 */

const AUTHOR = { '@type': 'Person', name: EDITORIAL.name, url: `${SITE.url}${EDITORIAL.href}` }
const ORGANIZATION_ID = `${SITE.url}/#organization`

export function breadcrumbSchema(items: Array<{ label: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE.url}${item.href}`,
    })),
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function webApplicationSchema({
  name,
  description,
  url,
  dateModified,
}: {
  name: string
  description: string
  url: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${SITE.url}${url}`,
    description,
    ...(dateModified ? { dateModified } : {}),
    author: AUTHOR,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

export function webPageSchema({
  name,
  description,
  url,
  dateModified,
}: {
  name: string
  description: string
  url: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: `${SITE.url}${url}`,
    description,
    ...(dateModified ? { dateModified } : {}),
    author: AUTHOR,
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/** Homepage only: names the brand once so search engines can resolve "StudentCalcHub" to this site. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    description: SITE.description,
    email: CONTACT_EMAIL,
    founder: AUTHOR,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'en-US',
    publisher: { '@id': ORGANIZATION_ID },
  }
}
