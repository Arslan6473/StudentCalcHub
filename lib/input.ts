import { fail, ok, type Result } from '@/lib/result'

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i

/**
 * Parses what a student typed into a number field. Rejects blanks, text,
 * thousands separators and non-finite values with a message rather than
 * letting NaN reach the result.
 */
export function parseNumberInput(raw: string): Result<number> {
  const text = raw.trim()
  if (text === '') return fail('Enter a number.')
  if (text.includes(',')) return fail('Remove commas — type 1200, not 1,200.')
  if (!NUMBER_PATTERN.test(text)) return fail('That isn’t a number.')
  const value = Number(text)
  if (!Number.isFinite(value)) return fail('That number is too large.')
  return ok(value)
}
