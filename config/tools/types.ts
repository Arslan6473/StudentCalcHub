import type { HubSlug } from '@/config/hubs'

export interface ToolFaq {
  question: string
  answer: string
}

export interface ToolConfig {
  slug: string
  hub: HubSlug
  name: string
  shortName: string
  /** One sentence, shown under the H1 and on hub cards. */
  summary: string
  /** YYYY-MM-DD */
  updated: string
  /** At least 4. Rendered on the page and as FAQPage JSON-LD. */
  faqs: ToolFaq[]
  /** Tool slugs, or site paths starting with '/'. */
  related: string[]
  sources: { label: string; url: string }[]
  seo: { title: string; description: string; keywords: string[] }
}
