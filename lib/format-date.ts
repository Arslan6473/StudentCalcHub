/** 'YYYY-MM-DD' → 'November 4, 2026'. Parsed as UTC so the printed day never shifts with the build machine's timezone. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
