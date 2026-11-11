import { ChartColumn, ClipboardCheck, FlaskConical, GraduationCap, type LucideIcon } from 'lucide-react'

import type { HubSlug } from '@/config/hubs'
import { cn } from '@/lib/utils'

const HUB_ICONS: Record<HubSlug, LucideIcon> = {
  gpa: GraduationCap,
  chemistry: FlaskConical,
  'test-prep': ClipboardCheck,
  statistics: ChartColumn,
}

/** The hub's icon in a soft accent tile. Decorative: the hub name is always shown beside it. */
export function HubIcon({ slug, className }: { slug: HubSlug; className?: string }) {
  const Icon = HUB_ICONS[slug]
  return (
    <span
      className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent', className)}
      aria-hidden
    >
      <Icon className="size-5" />
    </span>
  )
}
