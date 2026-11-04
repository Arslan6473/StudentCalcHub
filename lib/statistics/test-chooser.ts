/**
 * Decision tree for picking a common statistical test. Questions point at other
 * questions or at results by id; the tool, its tests and the printable flowchart
 * all read this one structure.
 */
export interface ChooserQuestion {
  id: string
  text: string
  help: string
  options: { label: string; next: string }[]
}

export interface ChooserResult {
  id: string
  test: string
  alternative?: string
  assumptions: string[]
  example: string
  whenNot: string
}

export const START_ID = 'goal'

const NORMAL_HELP =
  'Roughly normal means a histogram of the values (or of the differences, for paired data) is a single hump without strong skew or big outliers. With about 30 or more per group, t-tests and ANOVA usually hold up even when the data are a bit skewed.'

export const QUESTIONS: Record<string, ChooserQuestion> = {
  goal: {
    id: 'goal',
    text: 'What do you want to find out?',
    help: 'Pick the closest match to your research question.',
    options: [
      { label: 'Compare groups (is there a difference?)', next: 'compare-outcome' },
      { label: 'Relationship between two variables', next: 'relationship-type' },
      { label: 'Predict an outcome from one or more variables', next: 'predict-outcome' },
      { label: 'Check counts against an expected distribution', next: 'chi-square-gof' },
    ],
  },

  'compare-outcome': {
    id: 'compare-outcome',
    text: 'What kind of outcome are you measuring?',
    help: 'Continuous: measured numbers like height, time or a test score. Ordinal: ranked categories like a 1–5 rating. Categorical: labels like yes/no or a blood type.',
    options: [
      { label: 'Continuous (measured numbers)', next: 'continuous-groups' },
      { label: 'Ordinal (ranks or ratings)', next: 'ordinal-groups' },
      { label: 'Categorical (labels or yes/no)', next: 'categorical-groups' },
    ],
  },
  'continuous-groups': {
    id: 'continuous-groups',
    text: 'How many groups are you comparing?',
    help: 'One group means comparing your sample with a known or target value, like a population mean of 100.',
    options: [
      { label: 'One group vs. a known value', next: 'one-sample-normal' },
      { label: 'Two groups', next: 'two-design' },
      { label: 'Three or more groups', next: 'multi-design' },
    ],
  },
  'one-sample-normal': {
    id: 'one-sample-normal',
    text: 'Are the values roughly normal, or do you have 30 or more?',
    help: NORMAL_HELP,
    options: [
      { label: 'Yes — roughly normal or n ≥ 30', next: 'one-sample-t' },
      { label: 'No — skewed or small with outliers', next: 'wilcoxon-signed-rank' },
    ],
  },
  'two-design': {
    id: 'two-design',
    text: 'Are the two sets of measurements paired or independent?',
    help: 'Paired: the same people measured twice (before/after), or matched pairs like twins. Independent: different people in each group.',
    options: [
      { label: 'Paired — same subjects twice or matched pairs', next: 'paired-normal' },
      { label: 'Independent — different subjects in each group', next: 'independent-normal' },
    ],
  },
  'paired-normal': {
    id: 'paired-normal',
    text: 'Are the differences between pairs roughly normal, or do you have 30 or more pairs?',
    help: NORMAL_HELP,
    options: [
      { label: 'Yes — roughly normal or n ≥ 30', next: 'paired-t' },
      { label: 'No — skewed or small with outliers', next: 'wilcoxon-signed-rank' },
    ],
  },
  'independent-normal': {
    id: 'independent-normal',
    text: 'Is each group roughly normal, or do you have 30 or more per group?',
    help: NORMAL_HELP,
    options: [
      { label: 'Yes — roughly normal or n ≥ 30 per group', next: 'independent-t' },
      { label: 'No — skewed or small with outliers', next: 'mann-whitney' },
    ],
  },
  'multi-design': {
    id: 'multi-design',
    text: 'Are the groups repeated measurements or independent?',
    help: 'Repeated: the same subjects measured under every condition or at every time point. Independent: different subjects in each group.',
    options: [
      { label: 'Repeated — same subjects in every condition', next: 'repeated-normal' },
      { label: 'Independent — different subjects in each group', next: 'anova-normal' },
    ],
  },
  'repeated-normal': {
    id: 'repeated-normal',
    text: 'Are the values in each condition roughly normal, or do you have 30 or more subjects?',
    help: NORMAL_HELP,
    options: [
      { label: 'Yes — roughly normal or n ≥ 30', next: 'repeated-anova' },
      { label: 'No — skewed or small with outliers', next: 'friedman' },
    ],
  },
  'anova-normal': {
    id: 'anova-normal',
    text: 'Is each group roughly normal, or do you have 30 or more per group?',
    help: NORMAL_HELP,
    options: [
      { label: 'Yes — roughly normal or n ≥ 30 per group', next: 'one-way-anova' },
      { label: 'No — skewed or small with outliers', next: 'kruskal-wallis' },
    ],
  },

  'ordinal-groups': {
    id: 'ordinal-groups',
    text: 'How many groups are you comparing?',
    help: 'Ranked data are compared with rank-based (nonparametric) tests.',
    options: [
      { label: 'One group vs. a known value', next: 'wilcoxon-signed-rank' },
      { label: 'Two groups', next: 'ordinal-two-design' },
      { label: 'Three or more groups', next: 'ordinal-multi-design' },
    ],
  },
  'ordinal-two-design': {
    id: 'ordinal-two-design',
    text: 'Are the two sets of ratings paired or independent?',
    help: 'Paired: the same people rated twice. Independent: different people in each group.',
    options: [
      { label: 'Paired — same subjects twice', next: 'wilcoxon-signed-rank' },
      { label: 'Independent — different subjects', next: 'mann-whitney' },
    ],
  },
  'ordinal-multi-design': {
    id: 'ordinal-multi-design',
    text: 'Are the groups repeated measurements or independent?',
    help: 'Repeated: the same subjects rated under every condition. Independent: different subjects in each group.',
    options: [
      { label: 'Repeated — same subjects in every condition', next: 'friedman' },
      { label: 'Independent — different subjects in each group', next: 'kruskal-wallis' },
    ],
  },

  'categorical-groups': {
    id: 'categorical-groups',
    text: 'How are the groups set up?',
    help: 'For categorical outcomes you compare counts or proportions, such as the share who answered “yes” in each group.',
    options: [
      { label: 'One group vs. expected proportions', next: 'chi-square-gof' },
      { label: 'Two or more independent groups', next: 'expected-counts' },
      { label: 'Same subjects measured twice (yes/no before and after)', next: 'mcnemar' },
    ],
  },
  'expected-counts': {
    id: 'expected-counts',
    text: 'Are all expected counts in your table at least 5?',
    help: 'Expected count for a cell = row total × column total ÷ grand total. Most stats software prints these. The usual rule is that every expected count should be 5 or more.',
    options: [
      { label: 'Yes — every expected count is 5 or more', next: 'chi-square-independence' },
      { label: 'No — some expected counts are below 5', next: 'fisher-exact' },
    ],
  },

  'relationship-type': {
    id: 'relationship-type',
    text: 'What kind of variables are the two you’re relating?',
    help: 'Continuous: measured numbers. Ordinal: ranks or ratings. Categorical: labels like major or yes/no.',
    options: [
      { label: 'Both continuous', next: 'correlation-normal' },
      { label: 'At least one ordinal (ranks or ratings)', next: 'spearman' },
      { label: 'Both categorical', next: 'expected-counts' },
    ],
  },
  'correlation-normal': {
    id: 'correlation-normal',
    text: 'Does a scatterplot look like a straight-line trend without big outliers?',
    help: 'Pearson’s r measures straight-line relationships and is sensitive to outliers. If the trend curves but keeps going one way, or outliers stand out, use ranks instead.',
    options: [
      { label: 'Yes — roughly linear, no big outliers', next: 'pearson' },
      { label: 'No — curved, skewed or with outliers', next: 'spearman' },
    ],
  },

  'predict-outcome': {
    id: 'predict-outcome',
    text: 'What kind of outcome are you predicting?',
    help: 'The outcome is the variable you want to predict, such as exam score (continuous) or pass/fail (two categories).',
    options: [
      { label: 'Continuous (a number)', next: 'predictor-count' },
      { label: 'Two categories (yes/no, pass/fail)', next: 'logistic-regression' },
    ],
  },
  'predictor-count': {
    id: 'predictor-count',
    text: 'How many predictor variables do you have?',
    help: 'Predictors are the variables you use to make the prediction, such as hours studied or class attendance.',
    options: [
      { label: 'One predictor', next: 'simple-regression' },
      { label: 'Two or more predictors', next: 'multiple-regression' },
    ],
  },
}

export const RESULTS: Record<string, ChooserResult> = {
  'one-sample-t': {
    id: 'one-sample-t',
    test: 'One-sample t-test',
    alternative: 'Wilcoxon signed-rank test (one-sample) if the data are skewed and the sample is small.',
    assumptions: ['Observations are independent', 'Values are roughly normal, or n is about 30 or more', 'Outcome is continuous'],
    example: 'Is the mean sleep of 25 students in your class different from the recommended 8 hours?',
    whenNot: 'Don’t use it to compare two groups with each other — use a two-sample test instead.',
  },
  'independent-t': {
    id: 'independent-t',
    test: 'Independent t-test (two-sample t-test)',
    alternative:
      'Welch’s t-test, which doesn’t assume equal variances — many statisticians use it by default. Mann–Whitney U if the data are skewed and the samples are small.',
    assumptions: [
      'Two separate groups with different subjects',
      'Each group roughly normal, or about 30 or more per group',
      'Student’s version assumes equal variances; Welch’s does not',
    ],
    example: 'Do students who studied with flashcards score differently on a quiz than students who reread notes?',
    whenNot: 'Don’t use it when the same people are in both groups (use a paired t-test) or with three or more groups (use ANOVA).',
  },
  'mann-whitney': {
    id: 'mann-whitney',
    test: 'Mann–Whitney U test (Wilcoxon rank-sum)',
    alternative: 'Independent t-test (or Welch’s t-test) if both groups are roughly normal or large.',
    assumptions: ['Two separate groups with different subjects', 'Outcome is at least ordinal', 'Observations are independent'],
    example: 'Do two dorms differ in their satisfaction ratings on a 1–5 scale?',
    whenNot: 'Don’t use it for paired or before/after data — use the Wilcoxon signed-rank test.',
  },
  'paired-t': {
    id: 'paired-t',
    test: 'Paired t-test',
    alternative: 'Wilcoxon signed-rank test if the differences are skewed and there are few pairs.',
    assumptions: ['Each subject (or matched pair) measured twice', 'Differences are roughly normal, or about 30 or more pairs', 'Pairs are independent of each other'],
    example: 'Did the same 20 students score higher on the post-test than on the pre-test?',
    whenNot: 'Don’t use it when the two groups are different people — use an independent t-test.',
  },
  'wilcoxon-signed-rank': {
    id: 'wilcoxon-signed-rank',
    test: 'Wilcoxon signed-rank test',
    alternative: 'Paired t-test (or one-sample t-test) if the differences are roughly normal or there are 30 or more.',
    assumptions: ['Paired data, or one sample compared with a target value', 'Differences are at least ordinal', 'Differences are roughly symmetric around the median'],
    example: 'Did patients’ pain ratings (0–10) change after a new treatment?',
    whenNot: 'Don’t use it for two independent groups — use the Mann–Whitney U test.',
  },
  'one-way-anova': {
    id: 'one-way-anova',
    test: 'One-way ANOVA',
    alternative: 'Welch’s ANOVA if group variances differ; Kruskal–Wallis if the data are skewed and groups are small. Follow a significant result with a post-hoc test such as Tukey’s HSD.',
    assumptions: ['Three or more separate groups', 'Each group roughly normal, or large', 'Similar variances across groups', 'Observations are independent'],
    example: 'Does average exam score differ among students taught with three different methods?',
    whenNot: 'Don’t use it when the same subjects appear in every group — use repeated-measures ANOVA.',
  },
  'kruskal-wallis': {
    id: 'kruskal-wallis',
    test: 'Kruskal–Wallis test',
    alternative: 'One-way ANOVA if each group is roughly normal or large. Follow up with Dunn’s test to see which groups differ.',
    assumptions: ['Three or more separate groups', 'Outcome is at least ordinal', 'Observations are independent'],
    example: 'Do satisfaction ratings differ among freshmen, sophomores, juniors and seniors?',
    whenNot: 'Don’t use it for repeated measurements on the same subjects — use the Friedman test.',
  },
  'repeated-anova': {
    id: 'repeated-anova',
    test: 'Repeated-measures ANOVA',
    alternative: 'Friedman test if the data are skewed or ordinal. A linear mixed model handles missing time points better.',
    assumptions: ['Same subjects measured under every condition', 'Values roughly normal in each condition', 'Sphericity (check with Mauchly’s test; use a Greenhouse–Geisser correction if violated)'],
    example: 'Does reaction time change across morning, afternoon and evening for the same 15 participants?',
    whenNot: 'Don’t use it when each condition has different subjects — use one-way ANOVA.',
  },
  friedman: {
    id: 'friedman',
    test: 'Friedman test',
    alternative: 'Repeated-measures ANOVA if the values are roughly normal and continuous.',
    assumptions: ['Same subjects measured under every condition', 'Outcome is at least ordinal', 'Subjects are independent of each other'],
    example: 'Do the same judges rank three recipes differently?',
    whenNot: 'Don’t use it for independent groups — use Kruskal–Wallis.',
  },
  'chi-square-independence': {
    id: 'chi-square-independence',
    test: 'Chi-square test of independence',
    alternative: 'Fisher’s exact test if any expected count is below 5.',
    assumptions: ['Counts of subjects, not percentages or means', 'Each subject counted in exactly one cell', 'Every expected count is 5 or more'],
    example: 'Is there a relationship between class year and whether students live on campus?',
    whenNot: 'Don’t use it when the same subjects are counted twice (before/after) — use McNemar’s test.',
  },
  'fisher-exact': {
    id: 'fisher-exact',
    test: "Fisher's exact test",
    alternative: 'Chi-square test of independence when every expected count is 5 or more.',
    assumptions: ['Counts of subjects in a table (most often 2 × 2)', 'Each subject counted in exactly one cell', 'Works with small expected counts'],
    example: 'In a pilot study of 12 people, is recovery (yes/no) related to treatment (drug/placebo)?',
    whenNot: 'Don’t use it for before/after data on the same subjects — use McNemar’s test.',
  },
  mcnemar: {
    id: 'mcnemar',
    test: 'McNemar’s test',
    alternative: 'Cochran’s Q test for three or more time points with a yes/no outcome.',
    assumptions: ['The same subjects measured twice on a yes/no outcome', 'Paired data in a 2 × 2 table', 'Use the exact (binomial) version if the number of changed answers is small'],
    example: 'Did the share of students who passed a practice test change after a review session?',
    whenNot: 'Don’t use it for two independent groups — use chi-square or Fisher’s exact test.',
  },
  'chi-square-gof': {
    id: 'chi-square-gof',
    test: 'Chi-square goodness-of-fit test',
    alternative: 'An exact multinomial (or binomial) test if any expected count is below 5.',
    assumptions: ['Counts in categories from one sample', 'Each subject counted in exactly one category', 'Every expected count is 5 or more'],
    example: 'Are M&M colors in a bag in the proportions the company says?',
    whenNot: 'Don’t use it to compare two variables with each other — use the chi-square test of independence.',
  },
  pearson: {
    id: 'pearson',
    test: 'Pearson correlation (r)',
    alternative: 'Spearman’s rank correlation (ρ) if the trend is curved or has outliers.',
    assumptions: ['Both variables continuous', 'A straight-line relationship', 'No big outliers', 'For the p-value: roughly normal variables, or a large sample'],
    example: 'Is hours of sleep related to GPA among 50 students?',
    whenNot: 'Don’t use it to predict one variable from another — use regression. Correlation alone doesn’t show cause and effect.',
  },
  spearman: {
    id: 'spearman',
    test: 'Spearman rank correlation (ρ)',
    alternative: 'Pearson’s r if both variables are continuous with a straight-line trend.',
    assumptions: ['Both variables at least ordinal', 'A relationship that keeps going one way (monotonic)', 'Pairs are independent'],
    example: 'Is class rank related to the number of extracurricular activities?',
    whenNot: 'Don’t use it when the relationship goes up and then down — no correlation coefficient captures that well.',
  },
  'simple-regression': {
    id: 'simple-regression',
    test: 'Simple linear regression',
    alternative: 'Multiple regression if you need to control for other variables.',
    assumptions: ['Straight-line relationship', 'Independent observations', 'Residuals roughly normal with constant spread'],
    example: 'Predict final exam score from hours studied.',
    whenNot: 'Don’t use it for a yes/no outcome — use logistic regression.',
  },
  'multiple-regression': {
    id: 'multiple-regression',
    test: 'Multiple regression (multiple linear regression)',
    alternative: 'Add interaction or polynomial terms for curved relationships; consider regularized regression with many predictors.',
    assumptions: ['Linear relationships with each predictor', 'Independent observations', 'Residuals roughly normal with constant spread', 'Predictors not too highly correlated with each other'],
    example: 'Predict GPA from hours studied, hours worked and class attendance.',
    whenNot: 'Don’t use it for a yes/no outcome — use logistic regression.',
  },
  'logistic-regression': {
    id: 'logistic-regression',
    test: 'Logistic regression (binary)',
    alternative: 'Multinomial or ordinal logistic regression for outcomes with three or more categories.',
    assumptions: ['Outcome has two categories', 'Independent observations', 'A linear relationship between each continuous predictor and the log-odds', 'Enough cases of each outcome'],
    example: 'Predict whether a student passes (yes/no) from hours studied and attendance.',
    whenNot: 'Don’t use it for a continuous outcome — use linear regression.',
  },
}

/** Follow option indexes from the start. `path` is every question shown, including the current one. */
export function walk(answers: number[]): { path: ChooserQuestion[]; result: ChooserResult | null } {
  const path: ChooserQuestion[] = [QUESTIONS[START_ID]]
  for (const answer of answers) {
    const option = path[path.length - 1].options[answer]
    if (!option) break
    if (option.next in RESULTS) return { path, result: RESULTS[option.next] }
    path.push(QUESTIONS[option.next])
  }
  return { path, result: null }
}
