'use client'

import * as React from 'react'

import { ADSENSE_CLIENT, AD_SLOT_IDS, type AdPlacement } from '@/config/ads'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * One AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set,
 * so the site never shows empty boxes before approval. Placements are only
 * ever below a result, mid-article, or at the end of a page — never above a
 * calculator or between its inputs and result.
 */
export function AdSlot({ placement }: { placement: AdPlacement }) {
  const pushed = React.useRef(false)

  React.useEffect(() => {
    if (!ADSENSE_CLIENT || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded (blocked or offline) — the slot simply stays empty.
    }
  }, [])

  if (!ADSENSE_CLIENT) return null

  return (
    <div data-ad-slot={placement} className="my-8 min-h-24" aria-label="Advertisement">
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={AD_SLOT_IDS[placement]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
