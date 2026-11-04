import { loadDataDir } from '@/lib/data/load'
import { CollegeSchema, type College } from '@/lib/data/schema'

let cache: College[] | undefined

export function getColleges(): College[] {
  cache ??= loadDataDir('colleges', CollegeSchema).sort((a, b) => a.name.localeCompare(b.name))
  return cache
}

export function getCollege(slug: string): College | undefined {
  return getColleges().find((c) => c.slug === slug)
}
