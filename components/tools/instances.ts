import type { ComponentType } from 'react'

import type { ToolComponentSlug } from '@/components/tools/instance-slugs'
import { GradeConverterTool } from '@/components/tools/grade-converter/grade-converter-tool'
import { GramsToMolesCalculatorTool } from '@/components/tools/grams-to-moles-calculator/grams-to-moles-calculator-tool'
import { MolarityCalculatorTool } from '@/components/tools/molarity-calculator/molarity-calculator-tool'
import { PercentErrorCalculatorTool } from '@/components/tools/percent-error-calculator/percent-error-calculator-tool'
import { SigFigCalculatorTool } from '@/components/tools/sig-fig-calculator/sig-fig-calculator-tool'
import { WhichStatisticalTestTool } from '@/components/tools/which-statistical-test/which-statistical-test-tool'

export const TOOL_COMPONENTS: Record<ToolComponentSlug, ComponentType> = {
  'grade-converter': GradeConverterTool,
  'percent-error-calculator': PercentErrorCalculatorTool,
  'sig-fig-calculator': SigFigCalculatorTool,
  'grams-to-moles-calculator': GramsToMolesCalculatorTool,
  'molarity-calculator': MolarityCalculatorTool,
  'which-statistical-test': WhichStatisticalTestTool,
}

/** Same map, indexable by any registry slug (TOOL_COMPONENTS is keyed by the literal slug union). */
export const TOOL_COMPONENTS_BY_SLUG: Partial<Record<string, ComponentType>> = TOOL_COMPONENTS
