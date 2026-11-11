import { hubMetadata } from '@/lib/tool-route'
import { HubPage } from '@/components/tools/hub-page'

export const metadata = hubMetadata('gpa')

export default function Page() {
  return <HubPage slug="gpa" />
}
