import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { TOOLS } from '@/config/tools'

const REQUIRED_HEADINGS = ['## How it works', '## Worked example', '## When to use this', '## Common mistakes']

describe('tool MDX content', () => {
  for (const tool of TOOLS) {
    it(`${tool.slug} has every required section`, () => {
      const source = readFileSync(path.join(process.cwd(), 'content/tools', `${tool.slug}.mdx`), 'utf8')
      for (const heading of REQUIRED_HEADINGS) expect(source, heading).toContain(heading)
    })
  }
})
