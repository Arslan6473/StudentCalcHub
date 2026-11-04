import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { z } from 'zod'

/** Reads and validates every JSON file in data/<dir>. Throws naming the bad file, so a build fails loudly. */
export function loadDataDir<S extends z.ZodType>(dir: string, schema: S): z.infer<S>[] {
  const full = path.join(process.cwd(), 'data', dir)
  if (!existsSync(full)) return []
  return readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const raw = JSON.parse(readFileSync(path.join(full, file), 'utf8'))
      const parsed = schema.safeParse(raw)
      if (!parsed.success) throw new Error(`Invalid data in data/${dir}/${file}: ${parsed.error.message}`)
      return parsed.data
    })
}
