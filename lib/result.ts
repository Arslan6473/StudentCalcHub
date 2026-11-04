/** Calculation outcome: a value, or a short message the UI shows instead of a number. */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export const ok = <T>(value: T): Result<T> => ({ ok: true, value })
export const fail = <T = never>(error: string): Result<T> => ({ ok: false, error })
