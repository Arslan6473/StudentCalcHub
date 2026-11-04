import { BookOpenCheck } from 'lucide-react'

import { LEARNING_NOTE } from '@/config/site'

export function LearningNote() {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-card bg-accent-soft px-4 py-3 text-sm text-ink">
      <BookOpenCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <span>{LEARNING_NOTE}</span>
    </p>
  )
}
