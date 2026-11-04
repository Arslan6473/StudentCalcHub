import type { Metadata } from 'next'

import { getHub } from '@/config/hubs'
import { HubPage } from '@/components/tools/hub-page'

const hub = getHub('test-prep')!

export const metadata: Metadata = {
  title: hub.name,
  description: hub.summary,
  alternates: { canonical: hub.href },
}

export default function Page() {
  return <HubPage slug="test-prep" />
}
