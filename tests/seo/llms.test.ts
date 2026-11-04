import { describe, expect, it } from 'vitest'

import { GET } from '@/app/llms.txt/route'
import { SITE } from '@/config/site'
import { TOOLS, toolPath } from '@/config/tools'
import { getColleges } from '@/lib/data/colleges'
import { getStates } from '@/lib/data/states'

describe('llms.txt', () => {
  it('lists every tool, college and state page as an absolute link', async () => {
    const res = GET()
    expect(res.headers.get('Content-Type')).toContain('text/plain')
    const text = await res.text()
    expect(text.startsWith(`# ${SITE.name}`)).toBe(true)
    for (const t of TOOLS) expect(text).toContain(`(${SITE.url}${toolPath(t)})`)
    for (const c of getColleges()) expect(text).toContain(`(${SITE.url}/gpa/college/${c.slug})`)
    for (const s of getStates()) expect(text).toContain(`(${SITE.url}/high-school-credits/${s.slug})`)
  })
})
