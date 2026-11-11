import type { ToolConfig } from '@/config/tools/types'

export const gpaScaleConverter: ToolConfig = {
  slug: 'gpa-scale-converter',
  hub: 'gpa',
  name: 'GPA Scale Converter: 4.0, 10-Point, 20-Point & German Grades',
  shortName: 'GPA Scale Converter',
  summary:
    'Convert a GPA or grade between the 4.0, 5.0, 7-point, 10-point, 0–20 and percentage scales, or to a German grade with the modified Bavarian formula.',
  updated: '2026-11-11',
  faqs: [
    {
      question: 'How do I convert a 10-point CGPA to a 4.0 GPA?',
      answer:
        'A straight proportional conversion divides by 10 and multiplies by 4, so an 8.5 CGPA becomes 3.40. It is only an estimate: US universities and evaluators such as WES convert grade by grade with their own tables, so check which method your application uses.',
    },
    {
      question: 'What is the modified Bavarian formula?',
      answer:
        'It is the formula the KMK (Germany’s education ministers’ conference) sets for turning a foreign grade into a German one: German grade = 1 + 3 × (Nmax − Nd) ÷ (Nmax − Nmin). Nmax is the best grade on your scale, Nmin the lowest passing grade and Nd your grade. German universities publish it as a guide for applicants.',
    },
    {
      question: 'Why is my German grade cut off rather than rounded?',
      answer:
        'The KMK agreement says the converted grade is set to one decimal place and is not rounded. So a result of 1.75 becomes 1.7. Because lower is better in Germany, cutting off the extra digits never makes your grade worse.',
    },
    {
      question: 'Is a linear conversion what universities actually use?',
      answer:
        'Often not. Many universities and credential evaluators map each grade through a country-specific table, and some only accept an official evaluation. A linear conversion is transparent and good for a first comparison, but the number the admissions office uses can differ.',
    },
    {
      question: 'What pass mark should I use for the German conversion?',
      answer:
        'Use the minimum passing grade for your degree, as printed on your transcript or set by your university. It changes the result a lot: 14 out of 20 is a 2.8 with a pass mark of 10. For admission, uni-assist or the university applies the official values.',
    },
  ],
  related: [
    'grade-converter',
    'cgpa-to-percentage-calculator',
    'uk-degree-classification-calculator',
  ],
  sources: [
    {
      label:
        'KMK — Vereinbarung über die Festsetzung der Gesamtnote bei ausländischen Hochschulzugangszeugnissen (15.03.1991 i. d. F. 12.09.2013)',
      url: 'https://www.kmk.org/fileadmin/pdf/ZAB/Hochschulzugang_Beschluesse_der_KMK/GesNot05.pdf',
    },
    {
      label:
        'Hochschule Düsseldorf International Office — Grade conversion using the Bavarian formula',
      url: 'https://www.hs-duesseldorf.de/studium/internationales/Documents/GPA.pdf',
    },
    {
      label: 'Universität Hamburg — Notenumrechner (modified Bavarian formula, non-binding)',
      url: 'https://www.uni-hamburg.de/campuscenter/bewerbung/international/studium-mit-abschluss/anerkennung-auslaendischer-schulbildung/notenumrechner.html',
    },
    {
      label: 'The University of Queensland — Final grades (1–7 scale, 4 = Pass)',
      url: 'https://my.uq.edu.au/information-and-services/manage-my-program/exams-and-assessment/final-grades',
    },
    {
      label:
        'Université de Lorraine — How higher education works in France (0–20 scale, 10/20 to validate credits)',
      url: 'https://www.univ-lorraine.fr/welcome/how-higher-education-works-in-france',
    },
    {
      label: 'WES — Tools (iGPA calculator)',
      url: 'https://www.wes.org/wes-tools',
    },
  ],
  seo: {
    title: 'GPA Scale Converter: 4.0, 10, 20 & German | StudentCalcHub',
    description:
      'Convert a GPA between 4.0, 5.0, 7-point, 10-point CGPA, 0–20 and percentage scales, or to a German grade with the Bavarian formula. Shows every step.',
    keywords: [
      'gpa scale converter',
      'cgpa to gpa 4.0',
      'bavarian formula calculator',
      'convert gpa to german grade',
      'french grade to gpa',
    ],
  },
}
