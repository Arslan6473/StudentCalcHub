import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getTool } from '@/config/tools'
import { toolMetadata, toolStaticParams } from '@/lib/tool-route'
import { ToolPage } from '@/components/tools/tool-page'

export const dynamicParams = false

export function generateStaticParams() {
  return toolStaticParams('statistics')
}

export async function generateMetadata({ params }: PageProps<'/statistics/[tool]'>): Promise<Metadata> {
  const { tool } = await params
  return toolMetadata('statistics', tool)
}

export default async function Page({ params }: PageProps<'/statistics/[tool]'>) {
  const { tool: slug } = await params
  const tool = getTool('statistics', slug)
  if (!tool) notFound()
  return <ToolPage tool={tool} />
}
