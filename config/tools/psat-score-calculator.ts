import type { ToolConfig } from '@/config/tools/types'

export const psatScoreCalculator: ToolConfig = {
  slug: 'psat-score-calculator',
  hub: 'test-prep',
  name: 'PSAT Score Calculator for National Merit',
  shortName: 'PSAT Score',
  summary: 'Estimate your PSAT/NMSQT scores and National Merit Selection Index, and compare them with past state Semifinalist cutoffs.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'How is the National Merit Selection Index calculated?',
      answer:
        'Double your Reading and Writing score, add your Math score, and divide by 10. For example, 700 in Reading and Writing and 680 in Math gives (1,400 + 680) ÷ 10 = 208. The index runs from 48 to 228.',
    },
    {
      question: 'What score do I need for National Merit Semifinalist?',
      answer:
        'Each state has its own Selection Index cutoff, set every year after the test. For the Class of 2027 they ranged from 208 to 223. Next year’s cutoffs can be higher or lower, so treat past cutoffs as a guide only.',
    },
    {
      question: 'What is the Commended Student cutoff?',
      answer:
        'Commended Students are recognized nationally with one cutoff for all states. For the Class of 2027 it was a Selection Index of 208.',
    },
    {
      question: 'Does the PSAT 10 or PSAT 8/9 count for National Merit?',
      answer:
        'No. Only the PSAT/NMSQT taken in the fall of your junior year enters you into the National Merit Scholarship Program, and you have to meet NMSC’s other entry requirements.',
    },
    {
      question: 'Why is my PSAT score only an estimate?',
      answer:
        'The PSAT/NMSQT is adaptive: your second module in each section depends on how you did on the first, and question difficulty affects your score. There is no single fixed raw-score table to convert from.',
    },
  ],
  related: ['sat-score-calculator', 'act-score-calculator'],
  sources: [
    { label: 'College Board — Understanding PSAT/NMSQT Scores (score ranges and Selection Index formula)', url: 'https://satsuite.collegeboard.org/media/pdf/psat-nmsqt-understanding-scores.pdf' },
    { label: 'College Board — How the PSAT/NMSQT Is Structured', url: 'https://satsuite.collegeboard.org/psat-nmsqt/whats-on-the-test/structure' },
    { label: 'Compass Education Group — National Merit Semifinalist Cutoffs, Class of 2027', url: 'https://www.compassprep.com/national-merit-semifinalist-cutoffs/' },
  ],
  seo: {
    title: 'PSAT Score Calculator for National Merit | StudentCalcHub',
    description:
      'Estimate your PSAT/NMSQT score and National Merit Selection Index, then compare it with your state’s past Semifinalist cutoff. Free and private.',
    keywords: ['psat score calculator', 'psat score calculator for national merit', 'national merit selection index calculator', 'national merit cutoffs by state'],
  },
}
