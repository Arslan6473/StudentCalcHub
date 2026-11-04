import type { ToolConfig } from '@/config/tools/types'

export const gradeConverter: ToolConfig = {
  slug: 'grade-converter',
  hub: 'gpa',
  name: 'Letter Grade to GPA & Percentage Converter',
  shortName: 'Grade Converter',
  summary: 'Convert a percentage, letter grade or GPA on the standard 4.0 scale — with the steps and the full chart.',
  updated: '2026-11-04',
  faqs: [
    {
      question: 'What GPA is an 89.9%?',
      answer:
        'On the standard scale an 89.9% is a B+, which is worth 3.3 grade points. Most teachers do not round 89.9 up to 90 unless their syllabus says so, so check your class policy before counting on an A-.',
    },
    {
      question: 'Is an A+ worth 4.0 or 4.3?',
      answer:
        'On the standard unweighted 4.0 scale an A+ counts the same as an A: 4.0. A few colleges give an A+ 4.3 grade points, but many of them still cap the overall GPA at 4.0. Your school’s own scale decides.',
    },
    {
      question: 'Why does my school use different percentage cutoffs?',
      answer:
        'There is no national grading scale in the US. Each school or teacher picks the percentage bands for each letter. The common 93/90/87 bands are shown here, but some schools start an A at 90% or use a 10-point scale with no plus or minus grades.',
    },
    {
      question: 'Can I convert a weighted GPA to a letter grade?',
      answer:
        'Not directly. A weighted GPA above 4.0 includes bonus points for honors, AP or IB classes, so the same number can come from different letter grades. Convert each class grade on the unweighted scale instead.',
    },
    {
      question: 'How do I turn my letter grades into a GPA?',
      answer:
        'Look up the grade points for each class, multiply by the class’s credits or units, add those products, and divide by the total credits. That gives a credit-weighted GPA on the 4.0 scale.',
    },
  ],
  related: ['/gpa/latin-honors', '/high-school-credits'],
  sources: [
    {
      label: 'College Board BigFuture — How to Convert Your GPA to a 4.0 Scale',
      url: 'https://bigfuture.collegeboard.org/plan-for-college/college-basics/how-to-convert-gpa-4.0-scale',
    },
  ],
  seo: {
    title: 'Letter Grade to GPA & Percentage Converter | StudentCalcHub',
    description:
      'Convert percent to letter grade, letter grade to GPA, or GPA to percentage on the standard 4.0 scale. Shows the steps and a full letter grade chart.',
    keywords: ['letter grade to gpa', 'gpa to percentage', 'letter grade chart', 'percent to letter grade'],
  },
}
