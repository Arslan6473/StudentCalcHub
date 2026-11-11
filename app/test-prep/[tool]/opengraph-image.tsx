import { getHub } from '@/config/hubs'
import { getTool } from '@/config/tools'
import { toolStaticParams } from '@/lib/tool-route'
import { OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const alt = 'Free calculator with step-by-step working'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return toolStaticParams('test-prep')
}

export default async function Image({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getTool('test-prep', (await params).tool)
  return renderOgImage({
    eyebrow: getHub('test-prep')?.name ?? 'Calculator',
    title: tool?.name ?? 'Student calculator',
    subtitle: tool?.summary,
  })
}
