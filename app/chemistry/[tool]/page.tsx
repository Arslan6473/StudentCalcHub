import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getTool } from '@/config/tools'
import { toolMetadata, toolStaticParams } from '@/lib/tool-route'
import { ToolPage } from '@/components/tools/tool-page'

export const dynamicParams = false

export function generateStaticParams() {
  return toolStaticParams('chemistry')
}

export async function generateMetadata({ params }: PageProps<'/chemistry/[tool]'>): Promise<Metadata> {
  const { tool } = await params
  return toolMetadata('chemistry', tool)
}

export default async function Page({ params }: PageProps<'/chemistry/[tool]'>) {
  const { tool: slug } = await params
  const tool = getTool('chemistry', slug)
  if (!tool) notFound()
  return <ToolPage tool={tool} />
}
