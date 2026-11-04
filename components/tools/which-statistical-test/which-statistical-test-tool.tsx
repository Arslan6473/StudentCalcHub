'use client'

import * as React from 'react'
import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { walk } from '@/lib/statistics/test-chooser'

export function WhichStatisticalTestTool() {
  const [answers, setAnswers] = React.useState<number[]>([])
  const { path, result } = walk(answers)
  const current = result ? null : path[path.length - 1]
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // Move focus to the new question or result so keyboard and screen-reader users follow along.
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [answers.length])

  return (
    <div className="rounded-card border border-line bg-surface p-4 sm:p-6">
      {answers.length > 0 && (
        <nav aria-label="Your answers" className="mb-5">
          <ol className="space-y-1.5 text-sm">
            {answers.map((a, i) => (
              <li key={path[i].id}>
                <button
                  type="button"
                  className="text-left text-ink-muted underline-offset-2 hover:text-ink hover:underline"
                  onClick={() => setAnswers(answers.slice(0, i))}
                >
                  <span className="text-ink-subtle">{i + 1}. {path[i].text}</span>{' '}
                  <span className="font-medium text-ink">{path[i].options[a].label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div aria-live="polite">
        {current ? (
          <fieldset>
            <legend>
              <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-ink outline-none">
                {current.text}
              </h2>
            </legend>
            <p className="mt-2 text-sm text-ink-muted">{current.help}</p>
            <div className="mt-4 grid gap-2">
              {current.options.map((o, i) => (
                <Button
                  key={o.label}
                  type="button"
                  variant="outline"
                  className="h-auto justify-start py-3 text-left whitespace-normal"
                  onClick={() => setAnswers([...answers, i])}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </fieldset>
        ) : result ? (
          <section aria-labelledby="chooser-result">
            <p className="text-sm font-medium text-ink-subtle">Suggested test</p>
            <h2 id="chooser-result" ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold text-ink outline-none">
              {result.test}
            </h2>
            {result.alternative && (
              <p className="mt-3 text-sm text-ink-muted">
                <strong className="text-ink">Also consider:</strong> {result.alternative}
              </p>
            )}
            <h3 className="mt-5 text-sm font-semibold text-ink">Assumptions to check</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <h3 className="mt-5 text-sm font-semibold text-ink">Example</h3>
            <p className="mt-1 text-sm text-ink-muted">{result.example}</p>
            <h3 className="mt-5 text-sm font-semibold text-ink">When not to use it</h3>
            <p className="mt-1 text-sm text-ink-muted">{result.whenNot}</p>
          </section>
        ) : null}
      </div>

      {answers.length > 0 && (
        <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setAnswers([])} data-print-hide>
          <RotateCcw className="size-4" aria-hidden /> Start over
        </Button>
      )}
    </div>
  )
}
