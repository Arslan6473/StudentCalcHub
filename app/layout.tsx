import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { SITE } from '@/config/site'
import { THEME_INIT_SCRIPT, ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Header } from '@/components/navigation/header'
import { Footer } from '@/components/navigation/footer'
import { AdsenseScript } from '@/components/ads/adsense-script'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' })
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `Free Student Calculators That Show Every Step | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: { siteName: SITE.name, type: 'website', locale: 'en' },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions inject attributes onto <body> before hydration. */}
      <body className="flex min-h-full flex-col bg-canvas text-ink" suppressHydrationWarning>
        {/* Sets the `dark` class before hydration so there's no flash of the wrong theme. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
        {/* Cookieless page-view analytics and Core Web Vitals. Inactive outside Vercel. */}
        <Analytics />
        <SpeedInsights />
        <AdsenseScript />
      </body>
    </html>
  )
}
