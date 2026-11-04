// Warns (never fails) about data records not re-checked against their sources
// in 12 months. Mirrors lib/data/freshness.ts; runs as `prebuild`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const MAX_DAYS = 365
const DAY_MS = 24 * 60 * 60 * 1000
const root = path.join(process.cwd(), 'data')

function jsonFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return jsonFiles(full)
    return name.endsWith('.json') ? [full] : []
  })
}

const now = Date.now()
let stale = 0
for (const file of jsonFiles(root)) {
  const { lastChecked } = JSON.parse(readFileSync(file, 'utf8'))
  if (!lastChecked) continue
  if ((now - new Date(`${lastChecked}T00:00:00Z`).getTime()) / DAY_MS > MAX_DAYS) {
    console.warn(`⚠ stale data: ${path.relative(process.cwd(), file)} (last checked ${lastChecked})`)
    stale++
  }
}
console.log(`freshness check: ${stale} stale record(s)`)
