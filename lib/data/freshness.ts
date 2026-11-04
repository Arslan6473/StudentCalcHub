const DAY_MS = 24 * 60 * 60 * 1000

/** Slugs of records whose lastChecked is more than maxDays before today. */
export function staleRecords(
  records: { slug: string; lastChecked: string }[],
  today: Date,
  maxDays = 365,
): string[] {
  return records
    .filter((r) => (today.getTime() - new Date(`${r.lastChecked}T00:00:00Z`).getTime()) / DAY_MS > maxDays)
    .map((r) => r.slug)
}
