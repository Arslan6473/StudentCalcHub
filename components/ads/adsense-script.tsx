import Script from 'next/script'

import { ADSENSE_CLIENT } from '@/config/ads'

/** Loads the AdSense library only once a publisher id is configured. */
export function AdsenseScript() {
  if (!ADSENSE_CLIENT) return null
  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  )
}
