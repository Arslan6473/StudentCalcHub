import { ADSENSE_CLIENT, adsTxt } from '@/config/ads'

// Rendered at build time from NEXT_PUBLIC_ADSENSE_CLIENT. Before AdSense
// approval the env var is unset and this 404s, so no stale seller line is served.
export const dynamic = 'force-static'

export function GET() {
  const body = adsTxt(ADSENSE_CLIENT)
  if (!body) return new Response('Not found', { status: 404 })
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
