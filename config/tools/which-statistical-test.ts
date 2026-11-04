import type { ToolConfig } from '@/config/tools/types'

export const whichStatisticalTest: ToolConfig = {
  slug: 'which-statistical-test',
  hub: 'statistics',
  name: 'Which Statistical Test Should I Use?',
  shortName: 'Test Chooser',
  summary: 'Answer a few plain-language questions about your data and get the right statistical test, its assumptions and when not to use it.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'What is the difference between a t-test and a chi-square test?',
      answer:
        'A t-test compares the means of a continuous outcome, like test scores, between one or two groups. A chi-square test compares counts in categories, like how many students in each class year live on campus. Choose based on the kind of outcome you measured.',
    },
    {
      question: 'When should I use a nonparametric test?',
      answer:
        'Use a rank-based test (Mann–Whitney U, Wilcoxon signed-rank, Kruskal–Wallis, Friedman, Spearman) when the outcome is ordinal, or when the data are clearly skewed or have outliers and the sample is small. With about 30 or more per group, t-tests and ANOVA usually work even for somewhat skewed data.',
    },
    {
      question: 'What does paired mean?',
      answer:
        'Paired data come from the same subjects measured twice (before and after) or from matched pairs, like twins. Each value in one group has a partner in the other. Independent groups contain different subjects.',
    },
    {
      question: 'Should I use Welch’s t-test instead of Student’s t-test?',
      answer:
        'Often yes. Welch’s t-test doesn’t assume the two groups have equal variances, and it performs about as well as Student’s when they do. Many statistics instructors and software packages now use it by default — check what your course expects.',
    },
    {
      question: 'Does this tool run the test for me?',
      answer:
        'No. It helps you choose the test. Run the test in your statistics software or calculator, and check the listed assumptions against your data first.',
    },
  ],
  related: [],
  sources: [
    { label: 'UCLA OARC — Choosing the Correct Statistical Test', url: 'https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/' },
    { label: 'OpenStax Introductory Statistics 2e — 11.3 Test of Independence', url: 'https://openstax.org/books/introductory-statistics-2e/pages/11-3-test-of-independence' },
    { label: 'OpenStax Introductory Statistics 2e — Ch. 10 Hypothesis Testing with Two Samples', url: 'https://openstax.org/books/introductory-statistics-2e/pages/10-introduction' },
  ],
  seo: {
    title: 'Which Statistical Test Should I Use? | StudentCalcHub',
    description:
      'Answer a few questions about your data to pick a statistical test: t-test vs chi-square, ANOVA, Mann–Whitney, correlation or regression. Printable flowchart.',
    keywords: ['which statistical test should i use', 'statistical test flowchart', 't-test vs chi-square', 'choosing a statistical test'],
  },
}
