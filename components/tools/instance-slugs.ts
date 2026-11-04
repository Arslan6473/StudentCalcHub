/**
 * Slugs that have a calculator component. Kept apart from the component map
 * so registry tests can check coverage without importing client components;
 * instances.ts is typed against this list, so the two can't drift.
 */
export const TOOL_COMPONENT_SLUGS = [
  'grade-converter',
  'percent-error-calculator',
  'sig-fig-calculator',
  'grams-to-moles-calculator',
  'molarity-calculator',
  'which-statistical-test',
] as const

export type ToolComponentSlug = (typeof TOOL_COMPONENT_SLUGS)[number]
