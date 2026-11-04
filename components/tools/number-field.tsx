'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * A text input for numbers. Uses type="text" + inputMode="decimal" rather than
 * type="number" so what the student typed (e.g. "1500." or "1.50e3") reaches
 * the parser unchanged — sig-fig tools depend on the exact characters.
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  suffix,
  inputMode = 'decimal',
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string | null
  placeholder?: string
  suffix?: string
  inputMode?: 'decimal' | 'numeric' | 'text'
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          // Phone keyboards would otherwise capitalize "co2" into "Co2" (cobalt) or autocorrect "1.5x10^3".
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="figures"
        />
        {suffix && <span className="shrink-0 text-sm text-ink-muted">{suffix}</span>}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-loss">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-ink-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
