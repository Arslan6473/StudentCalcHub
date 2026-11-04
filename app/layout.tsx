import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'

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
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: SITE.name, type: 'website' },
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
        {/* Cookieless page-view analytics. Inactive outside Vercel. */}
        <Analytics />
        <AdsenseScript />
      </body>
    </html>
  )
}
