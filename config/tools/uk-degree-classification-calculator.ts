import type { ToolConfig } from '@/config/tools/types'

export const ukDegreeClassificationCalculator: ToolConfig = {
  slug: 'uk-degree-classification-calculator',
  hub: 'gpa',
  name: 'UK Degree Classification Calculator',
  shortName: 'UK Degree Class',
  summary:
    'Work out your likely UK honours degree class — First, 2:1, 2:2 or Third — from module credits, marks and year weightings, with the steps.',
  updated: '2026-11-11',
  faqs: [
    {
      question: 'What average do I need for a First or a 2:1?',
      answer:
        'On the usual UK boundaries a First needs an overall average of 70 or more, a 2:1 needs 60–69, a 2:2 needs 50–59 and a Third needs 40–49. Below 40 does not reach honours. Most universities use these bands, but check your own regulations.',
    },
    {
      question: 'Does first year count towards my degree classification?',
      answer:
        'Often not. Many universities only require you to pass first year and classify on the later years (Level 5 and Level 6 in England, Wales and Northern Ireland). Some count only the final year. Your programme handbook or degree regulations say which years count.',
    },
    {
      question: 'What year weighting should I use?',
      answer:
        'Use the one your university publishes. A final year counting twice as much as second year (1 : 2, about 33/67) is one common example, but other splits such as 25/75, or the final year alone, are also used. Some universities calculate more than one way and give you the better result.',
    },
    {
      question: 'What is a borderline degree classification?',
      answer:
        'Many universities have a zone just below each boundary, often 1.5 or 2 marks, such as 68–69.99 for a First. A student in that zone may be moved up by a rule, for example having at least half their credits in the higher class, or by an exam board decision. The zone and the rule are set by each university.',
    },
    {
      question: 'Why might my real classification differ from this calculator?',
      answer:
        'Each university publishes its own degree algorithm. Some leave out your lowest-scoring credits, round averages before classifying, apply preponderance or best-of-two-methods rules, or treat the dissertation specially. This calculator shows a plain weighted average on the usual boundaries, so use it as an estimate.',
    },
  ],
  related: [
    'grade-converter',
    'gpa-scale-converter',
    'cgpa-to-percentage-calculator',
    '/gpa/latin-honors',
  ],
  sources: [
    {
      label:
        'UKSCQA (Universities UK, GuildHE, QAA) — Principles for Effective Degree Algorithm Design (2020)',
      url: 'https://dera.ioe.ac.uk/id/eprint/36040/1/principles-effective-degree-algorithm-design.pdf',
    },
    {
      label:
        'QAA — The Frameworks for Higher Education Qualifications of UK Degree-Awarding Bodies, 2nd ed., Annex D',
      url: 'https://www.qaa.ac.uk/docs/qaa/quality-code/the-frameworks-for-higher-education-qualifications-of-uk-degree-awarding-bodies-2024.pdf?sfvrsn=3562b281_11',
    },
    {
      label:
        'University of Sheffield — Degree Outcomes Statement (example algorithm: 33.3% / 66.7%)',
      url: 'https://sheffield.ac.uk/media/17763/download',
    },
    {
      label:
        'Sheffield Hallam University — Regulation 10: Calculation of Awards (example algorithm with borderline rules)',
      url: 'https://www.shu.ac.uk/myhallam/university-life/university-rules-and-regulations/standard-assessment-regulations/regulation-10---calculation-of-awards',
    },
  ],
  seo: {
    title: 'UK Degree Classification Calculator | StudentCalcHub',
    description:
      'Estimate your UK honours degree class — First, 2:1, 2:2 or Third — from module credits, marks and year weightings. Shows each step and borderline zones.',
    keywords: [
      'degree classification calculator',
      'uk degree calculator',
      '2:1 calculator',
      'what degree will i get',
      'first class degree calculator',
    ],
  },
}
