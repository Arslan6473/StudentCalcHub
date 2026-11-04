import { SITE } from '@/config/site'
import { OG_SIZE, renderOgImage } from '@/lib/seo/og-image'

export const alt = `${SITE.name} — free calculators for students`
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free student calculators',
    title: 'Check your work. See every step.',
    subtitle: 'GPA, Latin honors, chemistry, statistics and test-score tools for US students.',
  })
}
