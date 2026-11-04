import type { ComponentType } from 'react'

import type { ToolComponentSlug } from '@/components/tools/instance-slugs'
import { GradeConverterTool } from '@/components/tools/grade-converter/grade-converter-tool'

export const TOOL_COMPONENTS: Record<ToolComponentSlug, ComponentType> = {
  'grade-converter': GradeConverterTool,
}

/** Same map, indexable by any registry slug (TOOL_COMPONENTS is keyed by the literal slug union). */
export const TOOL_COMPONENTS_BY_SLUG: Partial<Record<string, ComponentType>> = TOOL_COMPONENTS
