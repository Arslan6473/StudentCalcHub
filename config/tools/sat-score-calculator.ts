import type { ToolConfig } from '@/config/tools/types'

export const satScoreCalculator: ToolConfig = {
  slug: 'sat-score-calculator',
  hub: 'test-prep',
  name: 'Digital SAT Score Calculator',
  shortName: 'SAT Score',
  summary: 'Estimate your digital SAT section and total scores from the number of questions you got right on a practice test.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'How is the digital SAT scored?',
      answer:
        'Reading and Writing and Math are each scored from 200 to 800, in steps of 10, and added for a total from 400 to 1600. The test is adaptive, so your score depends on which questions you answered correctly and how hard they were, not just how many.',
    },
    {
      question: 'Why is this only an estimate?',
      answer:
        'College Board does not publish a fixed raw-to-scaled table for the digital SAT. Each section has two modules, and the second one is easier or harder depending on how you did on the first. The same number correct can therefore score differently on different forms.',
    },
    {
      question: 'How many questions are on the digital SAT?',
      answer: 'Reading and Writing has 54 questions in two modules of 27. Math has 44 questions in two modules of 22. A few in each module are unscored pretest questions, but you cannot tell which.',
    },
    {
      question: 'How accurate is a practice-test score?',
      answer:
        'Official Bluebook practice tests are scored the same way as the real test, so they are the best guide. Use this calculator when you have a raw count from a paper or third-party practice test and want a rough idea.',
    },
    {
      question: 'What is a good SAT score?',
      answer:
        'It depends on the colleges you are applying to. Look up each college’s middle 50% range for admitted students; a score at or above the middle of that range is competitive there.',
    },
  ],
  related: ['psat-score-calculator', 'act-score-calculator'],
  sources: [
    { label: 'College Board — How the SAT Is Structured', url: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure' },
    { label: 'College Board — Understanding PSAT/NMSQT Scores (SAT Suite scoring and adaptive design)', url: 'https://satsuite.collegeboard.org/media/pdf/psat-nmsqt-understanding-scores.pdf' },
  ],
  seo: {
    title: 'Digital SAT Score Calculator 2026 | StudentCalcHub',
    description:
      'Estimate your digital SAT score from the number of questions you got right. See section scores, a likely range, and why adaptive testing makes it an estimate.',
    keywords: ['sat score calculator', 'sat score calculator 2026 digital', 'digital sat score calculator', 'sat raw score conversion'],
  },
}
