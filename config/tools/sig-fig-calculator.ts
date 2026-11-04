import type { ToolConfig } from '@/config/tools/types'

export const sigFigCalculator: ToolConfig = {
  slug: 'sig-fig-calculator',
  hub: 'chemistry',
  name: 'Sig Fig Calculator — Count, Round & Calculate',
  shortName: 'Sig Fig Calculator',
  summary: 'Count significant figures, round to any number of sig figs, and add, subtract, multiply or divide with the right precision.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'How many significant figures does 1500 have?',
      answer:
        'Written as 1500 with no decimal point, it has 2 significant figures by the usual textbook rule — the trailing zeros might only be placeholders. Write 1500. (with a point) for 4, or 1.50 × 10^3 for 3.',
    },
    {
      question: 'Are leading zeros significant?',
      answer:
        'No. In 0.00450 the zeros before the 4 only place the decimal point. The 4, the 5 and the final 0 are significant, so it has 3 significant figures.',
    },
    {
      question: 'What is the sig fig rule for addition?',
      answer:
        'For addition and subtraction, round the answer to the fewest decimal places of any number you started with. 12.11 + 0.3 = 12.41, which rounds to 12.4 because 0.3 has only one decimal place.',
    },
    {
      question: 'What is the sig fig rule for multiplication?',
      answer:
        'For multiplication and division, round the answer to the fewest significant figures of any number you started with. 2.5 × 3.47 = 8.675, which rounds to 8.7 because 2.5 has two significant figures.',
    },
    {
      question: 'Do sig figs apply to exact numbers?',
      answer:
        'No. Counted numbers (like 3 trials) and defined conversions (like 100 cm in 1 m) are exact and have unlimited significant figures, so they never limit your answer. Only measured values do.',
    },
  ],
  related: ['percent-error-calculator'],
  sources: [
    {
      label: 'OpenStax Chemistry 2e — 1.5 Measurement Uncertainty, Accuracy, and Precision',
      url: 'https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision',
    },
    {
      label: 'OpenStax College Physics 2e — 1.3 Accuracy, Precision, and Significant Figures',
      url: 'https://openstax.org/books/college-physics-2e/pages/1-3-accuracy-precision-and-significant-figures',
    },
  ],
  seo: {
    title: 'Sig Fig Calculator: Count, Round & Add | StudentCalcHub',
    description:
      'Count significant figures, round to sig figs, and do sig fig addition, subtraction, multiplication and division. Handles scientific notation, with steps.',
    keywords: ['sig fig calculator', 'significant figures calculator', 'sig fig addition', 'sig figs scientific notation', 'rounding sig figs'],
  },
}
