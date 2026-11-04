import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getTool } from '@/config/tools'
import { toolMetadata, toolStaticParams } from '@/lib/tool-route'
import { ToolPage } from '@/components/tools/tool-page'

export const dynamicParams = false

export function generateStaticParams() {
  return toolStaticParams('gpa')
}

export async function generateMetadata({ params }: PageProps<'/gpa/[tool]'>): Promise<Metadata> {
  const { tool } = await params
  return toolMetadata('gpa', tool)
}

export default async function Page({ params }: PageProps<'/gpa/[tool]'>) {
  const { tool: slug } = await params
  const tool = getTool('gpa', slug)
  if (!tool) notFound()
  return <ToolPage tool={tool} />
}
