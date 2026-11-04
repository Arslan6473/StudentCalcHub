import type { ToolConfig } from '@/config/tools/types'

export const actScoreCalculator: ToolConfig = {
  slug: 'act-score-calculator',
  hub: 'test-prep',
  name: 'ACT Score Calculator (With or Without Science)',
  shortName: 'ACT Score',
  summary: 'Estimate your enhanced ACT section scores and composite from your correct answers, with an optional science and STEM score.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'How is the ACT composite score calculated?',
      answer:
        'On the enhanced ACT, the composite is the average of your English, Math and Reading scores, rounded to the nearest whole number. Fractions of one-half or more round up, so 30, 31 and 31 average 30.67 and give a composite of 31.',
    },
    {
      question: 'Does science count in the ACT composite?',
      answer:
        'No. Science is optional on the enhanced ACT and does not affect your composite. If you take it, you also get a STEM score: the average of your Math and Science scores.',
    },
    {
      question: 'How many questions are on the enhanced ACT?',
      answer: 'English has 50 questions, Math 45, Reading 36, and the optional Science section 40.',
    },
    {
      question: 'Why is this an estimate?',
      answer:
        'ACT equates each test form separately, so the scale score for a given number correct changes slightly from form to form. If your practice test came with its own scoring table, that table is more accurate for that test.',
    },
    {
      question: 'Should I take ACT science?',
      answer:
        'Check the colleges and scholarships you are applying to. Some STEM programs want to see a science or STEM score; many colleges only look at the composite.',
    },
  ],
  related: ['sat-score-calculator', 'psat-score-calculator'],
  sources: [
    { label: 'ACT — Understanding Your Scores (composite and STEM calculation)', url: 'https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html' },
    { label: 'ACT — Test Enhancements (question counts, optional science)', url: 'https://www.act.org/content/act/en/products-and-services/the-act/test-changes/enhancements.html' },
  ],
  seo: {
    title: 'ACT Score Calculator Without Science | StudentCalcHub',
    description:
      'Estimate your enhanced ACT composite from English, Math and Reading, with optional science and STEM scores. Shows a likely range for each section.',
    keywords: ['act score calculator', 'act score calculator without science', 'act composite score calculator', 'act stem score'],
  },
}
