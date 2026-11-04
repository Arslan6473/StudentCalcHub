import { ImageResponse } from 'next/og'

import { SITE } from '@/config/site'

export const OG_SIZE = { width: 1200, height: 630 }

/** Matches `--accent` in globals.css (oklch(48% 0.17 268)), converted to hex for the renderer. */
const ACCENT = '#3b4bc8'

/**
 * One layout for every social preview card so links shared anywhere read as
 * the same brand. Uses the renderer's built-in font to stay well under the 500KB bundle limit.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#ffffff',
        borderTop: `16px solid ${ACCENT}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 9l10-5 10 5-10 5z" />
            <path d="M6 11.5v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5" />
            <path d="M22 9v6" />
          </svg>
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#1a1f29' }}>{SITE.name}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: '#1a1f29', lineHeight: 1.1 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 32, color: '#525a68', lineHeight: 1.35 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ fontSize: 26, color: '#525a68' }}>{SITE.url.replace(/^https?:\/\//, '')}</div>
    </div>,
    OG_SIZE
  )
}
