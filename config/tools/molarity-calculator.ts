import type { ToolConfig } from '@/config/tools/types'

export const molarityCalculator: ToolConfig = {
  slug: 'molarity-calculator',
  hub: 'chemistry',
  name: 'Molarity Calculator & Dilution (M1V1 = M2V2)',
  shortName: 'Molarity',
  summary: 'Find the molarity of a solution from grams or moles, or solve the dilution equation M1V1 = M2V2 for any one value.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'What is the formula for molarity?',
      answer:
        'Molarity (M) = moles of solute ÷ liters of solution. If you know grams instead of moles, divide by the molar mass first. 5.844 g of NaCl is 0.1000 mol, and in 0.500 L that is 0.200 M.',
    },
    {
      question: 'Do I use mL or L for molarity?',
      answer:
        'Molarity is per liter, so convert mL to L by dividing by 1000. The calculator does this for you when you pick mL.',
    },
    {
      question: 'How do I use M1V1 = M2V2?',
      answer:
        'M1 and V1 are the concentration and volume of the stock solution you pour out; M2 and V2 are the concentration and total volume after adding water. Fill in three and solve for the fourth. Both volumes just need the same unit.',
    },
    {
      question: 'Is the volume the water I add or the total volume?',
      answer:
        'The total volume of the final solution. To make 200 mL of 0.5 M from 2 M stock, you use 50 mL of stock and add water until the total is 200 mL — about 150 mL of water.',
    },
    {
      question: 'What does it mean if M2 comes out bigger than M1?',
      answer:
        'Adding water can only lower the concentration, so that result is not a dilution. Usually the before and after values have been swapped. The calculator flags it.',
    },
  ],
  related: ['grams-to-moles-calculator', 'sig-fig-calculator', 'percent-error-calculator'],
  sources: [
    { label: 'OpenStax Chemistry 2e — 3.3 Molarity (includes dilution)', url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity' },
    { label: 'CIAAW (IUPAC) — Abridged Standard Atomic Weights', url: 'https://www.ciaaw.org/abridged-atomic-weights.htm' },
  ],
  seo: {
    title: 'Molarity Calculator & M1V1 = M2V2 Dilution | StudentCalcHub',
    description:
      'Calculate molarity from grams or moles and liters, or solve the dilution equation M1V1 = M2V2 for any value. Works in mL or L and shows each step.',
    keywords: ['molarity calculator', 'dilution calculator', 'm1v1 = m2v2 calculator', 'molarity formula', 'how to calculate molarity'],
  },
}
