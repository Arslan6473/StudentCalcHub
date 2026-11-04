export type HubSlug = 'gpa' | 'chemistry' | 'statistics' | 'test-prep'

export interface Hub {
  slug: HubSlug
  name: string
  shortName: string
  summary: string
  href: string
}

/** Homepage and navigation order: GPA & graduation leads (highest demand, weakest competition). */
export const HUBS: Hub[] = [
  {
    slug: 'gpa',
    name: 'GPA & Graduation',
    shortName: 'GPA',
    summary:
      'Convert grades, check your college’s GPA scale and Latin honors cutoffs, and count the high school credits you still need.',
    href: '/gpa',
  },
  {
    slug: 'chemistry',
    name: 'Chemistry & Lab',
    shortName: 'Chemistry',
    summary:
      'Percent error, significant figures, grams to moles and molarity — with every step shown so you can check your lab report.',
    href: '/chemistry',
  },
  {
    slug: 'test-prep',
    name: 'Test Prep',
    shortName: 'Test Prep',
    summary:
      'Estimate your SAT, PSAT/NMSQT and ACT scores from a practice test, including the National Merit Selection Index.',
    href: '/test-prep',
  },
  {
    slug: 'statistics',
    name: 'Statistics',
    shortName: 'Statistics',
    summary:
      'Find the right statistical test for your project and work out how big your sample needs to be.',
    href: '/statistics',
  },
]

export function getHub(slug: string): Hub | undefined {
  return HUBS.find((h) => h.slug === slug)
}

/** Data pages that live in a hub but aren't registry tools; listed on the hub index after its tools. */
export const HUB_EXTRA_LINKS: Record<HubSlug, { label: string; href: string; summary: string }[]> = {
  gpa: [
    {
      label: 'Latin Honors GPA Requirements by College',
      href: '/gpa/latin-honors',
      summary: 'Compare cum laude, magna cum laude and summa cum laude cutoffs, and check if you qualify.',
    },
    {
      label: 'High School Credits to Graduate by State',
      href: '/high-school-credits',
      summary: 'See how many credits your state requires, by subject, and how many you have left.',
    },
  ],
  chemistry: [],
  'test-prep': [],
  statistics: [],
}
