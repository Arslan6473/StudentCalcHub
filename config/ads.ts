/**
 * AdSense wiring. Everything is driven by env vars so the site ships with no
 * ads (and no ads.txt) until the AdSense account is approved.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export type AdPlacement = 'after-result' | 'in-content' | 'end-of-page'

export const AD_SLOT_IDS: Record<AdPlacement, string | undefined> = {
  'after-result': process.env.NEXT_PUBLIC_ADSENSE_SLOT_AFTER_RESULT,
  'in-content': process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT,
  'end-of-page': process.env.NEXT_PUBLIC_ADSENSE_SLOT_END_OF_PAGE,
}

/** The ads.txt body for a `ca-pub-…` client id, or null when ads aren't configured. */
export function adsTxt(client: string | undefined): string | null {
  if (!client) return null
  const publisher = client.replace(/^ca-/, '')
  return `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
}
