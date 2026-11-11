export const SITE = {
  name: 'StudentCalcHub',
  tagline: 'Free calculators that show the working.',
  description:
    'Free GPA, grade conversion, chemistry, statistics and test-score calculators for students worldwide. Every tool shows the steps so you can learn and check your own work.',
  /** Used to build absolute URLs for metadata, sitemap, and JSON-LD. Override with NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studentcalchub.com',
  disclaimerShort:
    'Results are for learning and checking only. They are not official — confirm with your school, registrar, or testing agency.',
} as const

/** Shown on the contact, about, and privacy pages, and used as the contact form's mailto target. */
export const CONTACT_EMAIL = 'arslansarwarwebdev@gmail.com'

/**
 * Who stands behind the tools. The byline links to the about page, which says
 * who the author is and how formulas and data are checked — and makes no claim
 * to academic credentials the author doesn't hold.
 */
export const EDITORIAL = {
  name: 'Arslan Sarwar',
  href: '/about',
} as const

/** Shown on every tool page, directly under the calculator. Exact wording is fixed by the spec. */
export const LEARNING_NOTE = 'Use this tool to learn and check your work, not to replace your own.'

export const FOOTER_LEGAL_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
] as const
