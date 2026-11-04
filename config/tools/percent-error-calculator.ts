import type { ToolConfig } from '@/config/tools/types'

export const percentErrorCalculator: ToolConfig = {
  slug: 'percent-error-calculator',
  hub: 'chemistry',
  name: 'Percent Error Calculator with Sig Figs',
  shortName: 'Percent Error',
  summary: 'Find the percent error between your measured and accepted values, rounded to the right number of significant figures.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'What is the percent error formula?',
      answer:
        'Percent error = |experimental − accepted| ÷ accepted × 100. Subtract the accepted value from your measured value, drop the sign, divide by the accepted value, and multiply by 100.',
    },
    {
      question: 'Can percent error be negative?',
      answer:
        'Only if you keep the sign. Many chemistry classes use the absolute value, so percent error is always positive. Some instructors want the sign kept: negative means your result was below the accepted value, positive means above. Use the checkbox to match your class.',
    },
    {
      question: 'How many sig figs should percent error have?',
      answer:
        'Apply the sig fig rules to each step. The subtraction keeps the least precise decimal place, so 52.3 − 50.0 = 2.3 has 2 sig figs; dividing by the accepted value then keeps the fewer of the two counts. So 52.3 vs 50.0 gives 4.6%, not 4.60%. Some instructors simply match the least precise measurement — choose a fixed count if yours does.',
    },
    {
      question: 'What if the accepted value is zero?',
      answer:
        'Percent error is undefined because you would divide by zero. Compare the two values another way, such as percent difference or the absolute error, and ask your instructor which one they want.',
    },
    {
      question: 'Is percent error the same in physics and chemistry?',
      answer:
        'Yes. The formula is the same in physics, chemistry and biology labs. What changes between classes is whether the sign is kept and how the answer is rounded.',
    },
  ],
  related: ['sig-fig-calculator'],
  sources: [
    {
      label: 'LibreTexts Chemistry (Univ. of Pittsburgh at Bradford, CHEM 0106) — 1.3 Percent Error',
      url: 'https://chem.libretexts.org/Courses/University_of_Pittsburgh_at_Bradford/CHEM_0106%3A_Chemistry_of_the_Environment/01%3A_Measurement/1.03%3A_Percent_Error',
    },
    {
      label: 'OpenStax Chemistry 2e — 1.5 Measurement Uncertainty, Accuracy, and Precision',
      url: 'https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision',
    },
  ],
  seo: {
    title: 'Percent Error Calculator with Sig Figs | StudentCalcHub',
    description:
      'Percent error calculator for chemistry and physics labs. Enter your experimental and accepted values to get the percent error with correct sig figs and steps.',
    keywords: ['percent error calculator', 'percent error chemistry', 'percent error with sig figs', 'percent error physics'],
  },
}
