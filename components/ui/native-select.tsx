import * as React from 'react'

import { cn } from '@/lib/utils'

/** A styled native <select> — the right control for repeated rows on phones. */
function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink transition-colors',
        'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
        className
      )}
      {...props}
    />
  )
}

export { NativeSelect }
