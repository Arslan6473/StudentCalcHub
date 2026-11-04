import { describe, expect, it } from 'vitest'

import { QUESTIONS, RESULTS, START_ID, walk } from '@/lib/statistics/test-chooser'

/** Walk by option labels (regex), so tests don't depend on option order. */
function walkLabels(...labels: RegExp[]) {
  const answers: number[] = []
  for (const label of labels) {
    const { path, result } = walk(answers)
    expect(result, `already finished before ${label}`).toBeNull()
    const q = path[path.length - 1]
    const index = q.options.findIndex((o) => label.test(o.label))
    expect(index, `no option matching ${label} in "${q.text}"`).toBeGreaterThanOrEqual(0)
    answers.push(index)
  }
  return walk(answers)
}

describe('test chooser tree', () => {
  it('starts at a real question', () => {
    expect(QUESTIONS[START_ID]).toBeDefined()
  })

  it('has every next pointing at a question or a result, never both', () => {
    for (const id of Object.keys(QUESTIONS)) expect(RESULTS[id], id).toBeUndefined()
    for (const q of Object.values(QUESTIONS)) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2)
      for (const o of q.options) expect(o.next in QUESTIONS || o.next in RESULTS, `${q.id} → ${o.next}`).toBe(true)
    }
  })

  it('reaches every question and result, with no cycles, in at most 6 answers', () => {
    const seen = new Set<string>()
    const visit = (id: string, depth: number, stack: string[]) => {
      expect(stack, `cycle at ${id}`).not.toContain(id)
      seen.add(id)
      if (id in RESULTS) {
        expect(depth, `${id} needs ${depth} answers`).toBeLessThanOrEqual(6)
        return
      }
      for (const o of QUESTIONS[id].options) visit(o.next, depth + 1, [...stack, id])
    }
    visit(START_ID, 0, [])
    for (const id of [...Object.keys(QUESTIONS), ...Object.keys(RESULTS)]) expect(seen.has(id), `${id} unreachable`).toBe(true)
  })

  it('gives every result its explanation fields', () => {
    for (const r of Object.values(RESULTS)) {
      expect(r.test.length, r.id).toBeGreaterThan(0)
      expect(r.assumptions.length, r.id).toBeGreaterThan(0)
      expect(r.example.length, r.id).toBeGreaterThan(0)
      expect(r.whenNot.length, r.id).toBeGreaterThan(0)
    }
  })

  it('covers the planned tests', () => {
    const tests = Object.values(RESULTS).map((r) => r.test).join(' | ')
    for (const name of [
      'One-sample t-test', 'Independent t-test', 'Mann–Whitney U', 'Paired t-test', 'Wilcoxon signed-rank', 'One-way ANOVA',
      'Kruskal–Wallis', 'Repeated-measures ANOVA', 'Friedman', 'Chi-square test of independence', "Fisher's exact test", 'McNemar',
      'Chi-square goodness-of-fit', 'Pearson', 'Spearman', 'Simple linear regression', 'Multiple regression', 'Logistic regression',
    ]) expect(tests).toContain(name)
  })
})

describe('walk', () => {
  it('starts with only the first question', () => {
    const { path, result } = walk([])
    expect(path.map((q) => q.id)).toEqual([START_ID])
    expect(result).toBeNull()
  })

  it('picks an independent t-test for two independent, roughly normal groups', () => {
    const { result } = walkLabels(/compare groups/i, /continuous/i, /^two/i, /different|independent/i, /normal|30/i)
    expect(result?.test).toMatch(/Independent t-test/)
    expect(result?.alternative ?? '').toMatch(/Welch/)
  })

  it('picks Mann–Whitney U when those groups are not normal', () => {
    const { result } = walkLabels(/compare groups/i, /continuous/i, /^two/i, /different|independent/i, /skewed|not/i)
    expect(result?.test).toMatch(/Mann–Whitney U/)
  })

  it("picks Fisher's exact test for two categorical variables with small expected counts", () => {
    const { result } = walkLabels(/relationship/i, /categorical/i, /fewer than 5|below 5|< ?5/i)
    expect(result?.test).toMatch(/Fisher's exact test/)
  })

  it('ignores an out-of-range answer instead of crashing', () => {
    const { path, result } = walk([99])
    expect(result).toBeNull()
    expect(path).toHaveLength(1)
  })
})
