import type { ComponentType } from 'react'

import type { ToolComponentSlug } from '@/components/tools/instance-slugs'
import { GradeConverterTool } from '@/components/tools/grade-converter/grade-converter-tool'
import { GpaScaleConverterTool } from '@/components/tools/gpa-scale-converter/gpa-scale-converter-tool'
import { CgpaToPercentageCalculatorTool } from '@/components/tools/cgpa-to-percentage-calculator/cgpa-to-percentage-calculator-tool'
import { UkDegreeClassificationCalculatorTool } from '@/components/tools/uk-degree-classification-calculator/uk-degree-classification-calculator-tool'
import { GramsToMolesCalculatorTool } from '@/components/tools/grams-to-moles-calculator/grams-to-moles-calculator-tool'
import { MolarityCalculatorTool } from '@/components/tools/molarity-calculator/molarity-calculator-tool'
import { PercentErrorCalculatorTool } from '@/components/tools/percent-error-calculator/percent-error-calculator-tool'
import { SigFigCalculatorTool } from '@/components/tools/sig-fig-calculator/sig-fig-calculator-tool'
import { WhichStatisticalTestTool } from '@/components/tools/which-statistical-test/which-statistical-test-tool'
import { SampleSizeCalculatorTool } from '@/components/tools/sample-size-calculator/sample-size-calculator-tool'
import { SatScoreCalculatorTool } from '@/components/tools/sat-score-calculator/sat-score-calculator-tool'
import { PsatScoreCalculatorTool } from '@/components/tools/psat-score-calculator/psat-score-calculator-tool'
import { ActScoreCalculatorTool } from '@/components/tools/act-score-calculator/act-score-calculator-tool'

export const TOOL_COMPONENTS: Record<ToolComponentSlug, ComponentType> = {
  'grade-converter': GradeConverterTool,
  'gpa-scale-converter': GpaScaleConverterTool,
  'cgpa-to-percentage-calculator': CgpaToPercentageCalculatorTool,
  'uk-degree-classification-calculator': UkDegreeClassificationCalculatorTool,
  'percent-error-calculator': PercentErrorCalculatorTool,
  'sig-fig-calculator': SigFigCalculatorTool,
  'grams-to-moles-calculator': GramsToMolesCalculatorTool,
  'molarity-calculator': MolarityCalculatorTool,
  'which-statistical-test': WhichStatisticalTestTool,
  'sample-size-calculator': SampleSizeCalculatorTool,
  'sat-score-calculator': SatScoreCalculatorTool,
  'psat-score-calculator': PsatScoreCalculatorTool,
  'act-score-calculator': ActScoreCalculatorTool,
}

/** Same map, indexable by any registry slug (TOOL_COMPONENTS is keyed by the literal slug union). */
export const TOOL_COMPONENTS_BY_SLUG: Partial<Record<string, ComponentType>> = TOOL_COMPONENTS
