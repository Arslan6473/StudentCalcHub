import type { ComponentType } from 'react'

import type { ToolComponentSlug } from '@/components/tools/instance-slugs'

export const TOOL_COMPONENTS: Record<ToolComponentSlug, ComponentType> = {}

/** Same map, indexable by any registry slug (TOOL_COMPONENTS is keyed by the literal slug union). */
export const TOOL_COMPONENTS_BY_SLUG: Partial<Record<string, ComponentType>> = TOOL_COMPONENTS
