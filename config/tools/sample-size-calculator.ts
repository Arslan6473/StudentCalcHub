import type { ToolConfig } from '@/config/tools/types'

export const sampleSizeCalculator: ToolConfig = {
  slug: 'sample-size-calculator',
  hub: 'statistics',
  name: 'Sample Size Calculator',
  shortName: 'Sample Size',
  summary: 'Work out how many survey responses or measurements you need for a chosen confidence level and margin of error.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'What is the sample size formula for a survey?',
      answer:
        'For a proportion, n = z² × p(1 − p) ÷ E², where z comes from your confidence level, p is the expected proportion and E is the margin of error as a decimal. Always round up to the next whole number.',
    },
    {
      question: 'Why use p = 0.5 if I don’t know the proportion?',
      answer:
        'p(1 − p) is largest when p = 0.5, so it gives the biggest sample size of any p. Using it means your margin of error will be at most what you asked for, whatever the true proportion turns out to be.',
    },
    {
      question: 'How do I calculate sample size with a standard deviation?',
      answer:
        'When you are estimating a mean, use n = (z × σ ÷ E)², where σ is the standard deviation and E is the margin of error in the same units. Get σ from a pilot study or earlier research on the same measurement.',
    },
    {
      question: 'When should I enter the population size?',
      answer:
        'Only when your sample is a noticeable share of the whole group, for example surveying a school of 1,000 students. The finite population correction then lowers the number you need. For large or unknown populations, leave it blank.',
    },
    {
      question: 'Does a bigger sample fix a biased survey?',
      answer:
        'No. The formula only controls random sampling error. If the people who answer differ from those who do not, or the question is leading, a larger sample gives you a more precise wrong answer.',
    },
  ],
  related: ['which-statistical-test'],
  sources: [
    {
      label: 'OpenStax Introductory Statistics 2e — 8.3 A Population Proportion',
      url: 'https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion',
    },
    {
      label: 'OpenStax Introductory Statistics 2e — 8.1 A Single Population Mean using the Normal Distribution',
      url: 'https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution',
    },
    {
      label: 'NIST/SEMATECH e-Handbook of Statistical Methods — 7.2.2.2 Sample sizes required',
      url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm',
    },
  ],
  seo: {
    title: 'Sample Size Calculator for Surveys | StudentCalcHub',
    description:
      'Sample size calculator for surveys and research projects. Choose a confidence level and margin of error, or use a standard deviation, and see the formula steps.',
    keywords: ['sample size calculator', 'sample size calculator for survey', 'sample size formula', 'sample size calculator with standard deviation'],
  },
}
