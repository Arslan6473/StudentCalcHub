import { loadDataDir } from '@/lib/data/load'
import { StateSchema, type State } from '@/lib/data/schema'

let cache: State[] | undefined

export function getStates(): State[] {
  cache ??= loadDataDir('states', StateSchema).sort((a, b) => a.name.localeCompare(b.name))
  return cache
}

export function getState(slug: string): State | undefined {
  return getStates().find((s) => s.slug === slug)
}
