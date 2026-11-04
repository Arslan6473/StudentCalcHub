import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getTool } from '@/config/tools'
import { toolMetadata, toolStaticParams } from '@/lib/tool-route'
import { ToolPage } from '@/components/tools/tool-page'

export const dynamicParams = false

export function generateStaticParams() {
  return toolStaticParams('test-prep')
}

export async function generateMetadata({ params }: PageProps<'/test-prep/[tool]'>): Promise<Metadata> {
  const { tool } = await params
  return toolMetadata('test-prep', tool)
}

export default async function Page({ params }: PageProps<'/test-prep/[tool]'>) {
  const { tool: slug } = await params
  const tool = getTool('test-prep', slug)
  if (!tool) notFound()
  return <ToolPage tool={tool} />
}
