import type { ToolConfig } from '@/config/tools/types'

export const cgpaToPercentageCalculator: ToolConfig = {
  slug: 'cgpa-to-percentage-calculator',
  hub: 'gpa',
  name: 'CGPA to Percentage Calculator',
  shortName: 'CGPA to %',
  summary: 'Convert a 10-point CGPA to a percentage and back, using CBSE’s formula, a university’s published one, or your own.',
  updated: '2026-11-11',
  faqs: [
    {
      question: 'How do I convert CBSE CGPA to percentage?',
      answer:
        'Multiply your CGPA by 9.5. CBSE’s 2010 circular gives the overall indicative percentage as 9.5 × CGPA, so a CGPA of 8.6 is 81.7%. The same rule works for one subject: 9.5 × that subject’s grade point.',
    },
    {
      question: 'Is CGPA × 9.5 the formula for every university?',
      answer:
        'No. The 9.5 factor comes from CBSE’s Class X grading scheme. Universities publish their own rules: IISc and Cotton University multiply by 10, MIT ADT University in Pune multiplies by 9.56, and some subtract a number first. Use the formula printed on your transcript or in your university’s notice.',
    },
    {
      question: 'What does (CGPA − 0.75) × 10 mean?',
      answer:
        'It is an offset formula: subtract 0.75 from your CGPA, then multiply by 10. Some universities publish formulas in this shape. Choose the custom option, enter 10 as the multiplier and 0.75 as the offset, and only use it if your own university’s notice gives exactly those numbers.',
    },
    {
      question: 'Can I convert a percentage back to CGPA?',
      answer:
        'Yes, by undoing the formula: divide the percentage by the multiplier, then add back any offset. Under CBSE’s rule, 85.5% ÷ 9.5 = a CGPA of 9.0. Some percentages have no CGPA — with × 9.5 the highest possible is 95%.',
    },
    {
      question: 'Which percentage should I put on an application?',
      answer:
        'If the form asks for a percentage, use your university’s own conversion and keep its notice or a conversion certificate as proof. Some employers and admissions offices also state which formula they accept. A calculator result, including this one, is not an official document.',
    },
    {
      question: 'What about an 8-point or 4-point CGPA?',
      answer:
        'This calculator only covers 10-point CGPAs. IISc, for example, multiplies its older 8-point CGPA by 12.5 instead of 10. For a US-style 4.0 GPA, use the GPA scale converter.',
    },
  ],
  related: ['grade-converter', 'gpa-scale-converter', 'uk-degree-classification-calculator'],
  sources: [
    {
      label: 'CBSE Circular No. 24/28-05-2010 — Admission in Class XI after introduction of grading',
      url: 'https://www.cbse.gov.in/circulars/cir24-2010.pdf',
    },
    {
      label: 'IISc Bangalore — Formula for Notional Conversion of CGPA to Percentage (14 Oct 2021)',
      url: 'https://www.iisc.ac.in/wp-content/uploads/2021/10/IISc-CGPA-Percentage-Conversion-notification-signed.pdf',
    },
    {
      label: 'Cotton University — CGPA to equivalent percentage formula (28 Aug 2020)',
      url: 'https://cottonuniversity.ac.in/storage/uploads/pdf/CGPA_to_PercentageNotification_280820.pdf',
    },
    {
      label: 'MIT Art, Design and Technology University, Pune — Formula for conversion of CGPA (20 May 2021)',
      url: 'https://mituniversity.ac.in/assets_web/pdf/exam%20dept/Circular/8%20-%20Circular%20-%20CGPA%20To%20Percentage%20Formula.pdf',
    },
  ],
  seo: {
    title: 'CGPA to Percentage Calculator (CBSE & More) | StudentCalcHub',
    description:
      'Convert CGPA to percentage and percentage to CGPA on a 10-point scale. CBSE ×9.5, published university formulas, or your own — with the working shown.',
    keywords: ['cgpa to percentage', 'cgpa to percentage calculator', 'cbse cgpa to percentage', 'percentage to cgpa'],
  },
}
