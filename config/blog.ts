import type { HubSlug } from '@/config/hubs'

export const BLOG_CATEGORIES = [
  {
    slug: 'study-abroad',
    name: 'Study Abroad',
    summary: 'Converting grades between countries and what admissions offices actually look at.',
  },
  {
    slug: 'gpa-grades',
    name: 'GPA & Grades',
    summary: 'How GPAs, degree classifications and grading scales work around the world.',
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    summary: 'Lab math explained step by step: percent error, sig figs, moles and molarity.',
  },
  {
    slug: 'statistics',
    name: 'Statistics',
    summary: 'Picking the right test and sizing your sample for a project or dissertation.',
  },
  {
    slug: 'test-prep',
    name: 'Test Prep',
    summary: 'How SAT, PSAT and ACT scores are built and what your practice results mean.',
  },
] as const

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]['slug']

export function getBlogCategory(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)
}

export const BLOG = {
  name: 'Study Guides',
  href: '/blog',
  summary:
    'Plain-English guides to grades, lab math, statistics and exams — written for students everywhere, with worked examples and official sources.',
} as const

/** Which guide categories a tool hub shows under its tools. */
export const HUB_BLOG_CATEGORIES: Record<HubSlug, BlogCategorySlug[]> = {
  gpa: ['gpa-grades', 'study-abroad'],
  chemistry: ['chemistry'],
  'test-prep': ['test-prep'],
  statistics: ['statistics'],
}
