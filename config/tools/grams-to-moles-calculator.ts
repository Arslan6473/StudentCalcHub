import type { ToolConfig } from '@/config/tools/types'

export const gramsToMolesCalculator: ToolConfig = {
  slug: 'grams-to-moles-calculator',
  hub: 'chemistry',
  name: 'Grams to Moles Calculator with Molar Mass',
  shortName: 'Grams to Moles',
  summary: 'Type any chemical formula to get its molar mass, then convert grams to moles, moles to grams, and moles to particles.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'How do you convert grams to moles?',
      answer:
        'Divide the mass in grams by the molar mass in g/mol. For water (18.015 g/mol), 36.03 g ÷ 18.015 g/mol = 2.000 mol.',
    },
    {
      question: 'How do I find the molar mass of a compound?',
      answer:
        'Multiply each element’s atomic mass by the number of atoms of that element in the formula, then add the results. For H2O: 2 × 1.008 + 1 × 15.999 = 18.015 g/mol.',
    },
    {
      question: 'How do I enter a hydrate like CuSO4·5H2O?',
      answer:
        'Type the dot as ·, * or a plain period: CuSO4·5H2O, CuSO4*5H2O and CuSO4.5H2O all work. The number after the dot multiplies the water.',
    },
    {
      question: 'Why does capitalization matter?',
      answer:
        'Element symbols start with a capital letter and may have one lowercase letter after it. Co is cobalt, but CO is carbon and oxygen — carbon monoxide. The calculator reads the formula exactly as you type it.',
    },
    {
      question: 'How do I convert moles to number of particles?',
      answer:
        'Multiply moles by Avogadro’s number, 6.02214076 × 10^23 particles per mole. 2.000 mol of water is about 1.204 × 10^24 molecules.',
    },
  ],
  related: ['molarity-calculator', 'sig-fig-calculator', 'percent-error-calculator'],
  sources: [
    { label: 'CIAAW (IUPAC) — Abridged Standard Atomic Weights', url: 'https://www.ciaaw.org/abridged-atomic-weights.htm' },
    { label: 'OpenStax Chemistry 2e — 3.1 Formula Mass and the Mole Concept', url: 'https://openstax.org/books/chemistry-2e/pages/3-1-formula-mass-and-the-mole-concept' },
    { label: 'NIST — Meet the Constants (Avogadro constant)', url: 'https://www.nist.gov/si-redefinition/meet-constants' },
  ],
  seo: {
    title: 'Grams to Moles Calculator & Molar Mass | StudentCalcHub',
    description:
      'Convert grams to moles or moles to grams for any formula. Shows the molar mass breakdown by element, Avogadro particle count and every step of the working.',
    keywords: ['grams to moles calculator', 'molar mass calculator', 'moles to grams', 'grams to moles', 'moles to particles'],
  },
}
