import type { ToolFaq } from '@/config/tools/types'
import type { GraduationPlan, State } from '@/lib/data/schema'

const credits = (n: number) => `${n} credit${n === 1 ? '' : 's'}`

/** Credits left for electives once every named subject is covered. */
export function electiveCredits(plan: Pick<GraduationPlan, 'totalCredits' | 'subjects'>): number {
  const named = plan.subjects.reduce((sum, s) => sum + s.credits, 0)
  return Math.max(0, Math.round((plan.totalCredits - named) * 100) / 100)
}

function totalsPhrase(state: State): string {
  const totals = state.plans.map((p) => p.totalCredits)
  const min = Math.min(...totals)
  const max = Math.max(...totals)
  return min === max ? `${min} credits` : `${min} to ${max} credits`
}

function subjectList(plan: GraduationPlan): string {
  const parts = plan.subjects.map((s) => `${credits(s.credits)} of ${s.label}`)
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]
}

/** The page's opening answer: the credit total first, then the plans. */
export function stateIntro(state: State): string {
  const first = `${state.name} requires ${totalsPhrase(state)} to graduate from high school (class of ${state.appliesToClassOf}).`
  if (state.plans.length === 1) {
    const p = state.plans[0]
    return `${first} That includes ${subjectList(p)}, plus ${credits(electiveCredits(p))} of electives.`
  }
  const plans = state.plans.map((p) => `${p.name} (${p.totalCredits})`).join(', ')
  return `${first} The state has ${state.plans.length} diploma options: ${plans}.`
}

/** FAQ entries built from the state's own data, so each state page answers its own questions. */
export function stateFaqs(state: State): ToolFaq[] {
  const main = state.plans[0]
  const faqs: ToolFaq[] = [
    {
      question: `How many credits do you need to graduate high school in ${state.name}?`,
      answer:
        state.plans.length === 1
          ? `The state minimum is ${credits(main.totalCredits)} for the class of ${state.appliesToClassOf}. Your district may ask for more.`
          : `It depends on the diploma: ${state.plans.map((p) => `${p.name} needs ${credits(p.totalCredits)}`).join('; ')}. These are state minimums for the class of ${state.appliesToClassOf}.`,
    },
    {
      question: `Which subjects does ${state.name} require for the ${main.name}?`,
      answer: `You need ${subjectList(main)}. The other ${credits(electiveCredits(main))} can be electives of your choice.`,
    },
    {
      question: `Are there graduation requirements in ${state.name} besides credits?`,
      answer:
        state.otherRequirements.length > 0
          ? `Yes. ${state.otherRequirements.join('. ').replace(/\.?$/, '.')}`
          : 'The state sources we checked list no statewide requirements beyond credits, but your school may have its own (such as tests or service hours).',
    },
    {
      question: `Can my school require more credits than the ${state.name} minimum?`,
      answer: state.districtNote,
    },
  ]
  if (state.plans.length > 1) {
    faqs.push({
      question: `What is the difference between the ${state.name} diploma options?`,
      answer: state.plans
        .map((p) => `${p.name}: ${credits(p.totalCredits)}${p.notes ? ` — ${p.notes.replace(/\.$/, '')}` : ''}.`)
        .join(' '),
    })
  }
  return faqs
}
