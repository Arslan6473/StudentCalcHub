import type { HubSlug } from '@/config/hubs'
import type { ToolConfig } from '@/config/tools/types'
import { gradeConverter } from '@/config/tools/grade-converter'
import { gpaScaleConverter } from '@/config/tools/gpa-scale-converter'
import { cgpaToPercentageCalculator } from '@/config/tools/cgpa-to-percentage-calculator'
import { ukDegreeClassificationCalculator } from '@/config/tools/uk-degree-classification-calculator'
import { gramsToMolesCalculator } from '@/config/tools/grams-to-moles-calculator'
import { molarityCalculator } from '@/config/tools/molarity-calculator'
import { percentErrorCalculator } from '@/config/tools/percent-error-calculator'
import { sigFigCalculator } from '@/config/tools/sig-fig-calculator'
import { whichStatisticalTest } from '@/config/tools/which-statistical-test'
import { sampleSizeCalculator } from '@/config/tools/sample-size-calculator'
import { satScoreCalculator } from '@/config/tools/sat-score-calculator'
import { psatScoreCalculator } from '@/config/tools/psat-score-calculator'
import { actScoreCalculator } from '@/config/tools/act-score-calculator'

/** Single source of truth for tool routes, hub listings, sitemap and related links. */
export const TOOLS: ToolConfig[] = [
  gradeConverter,
  gpaScaleConverter,
  cgpaToPercentageCalculator,
  ukDegreeClassificationCalculator,
  percentErrorCalculator,
  sigFigCalculator,
  gramsToMolesCalculator,
  molarityCalculator,
  whichStatisticalTest,
  sampleSizeCalculator,
  satScoreCalculator,
  psatScoreCalculator,
  actScoreCalculator,
]

export function getTool(hub: HubSlug, slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.hub === hub && t.slug === slug)
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug)
}

export function toolsInHub(hub: HubSlug): ToolConfig[] {
  return TOOLS.filter((t) => t.hub === hub)
}

export function toolPath(tool: Pick<ToolConfig, 'hub' | 'slug'>): string {
  return `/${tool.hub}/${tool.slug}`
}

/** Related entries as display links: tool slugs resolve to their tool; '/paths' pass through with a label. */
export function relatedLinks(tool: ToolConfig): { label: string; href: string; summary?: string }[] {
  return tool.related.flatMap((rel) => {
    if (rel.startsWith('/')) return [{ label: RELATED_PATH_LABELS[rel] ?? rel, href: rel }]
    const target = getToolBySlug(rel)
    return target ? [{ label: target.name, href: toolPath(target), summary: target.summary }] : []
  })
}

const RELATED_PATH_LABELS: Record<string, string> = {
  '/gpa/latin-honors': 'Latin Honors GPA Requirements by US College',
  '/high-school-credits': 'US High School Credits to Graduate by State',
}
