import { expect, test, type Page } from '@playwright/test'

import { LEARNING_NOTE } from '../config/site'
import { TOOLS, toolPath } from '../config/tools'

/** Vercel Web Analytics and Speed Insights only exist on Vercel; locally their scripts 404. */
const IGNORED_CONSOLE = [/_vercel\/(insights|speed-insights)/]

async function sitemapPaths(page: Page): Promise<string[]> {
  const res = await page.request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

test('every sitemap page loads cleanly at 375px', async ({ page }) => {
  test.setTimeout(180_000)
  const paths = await sitemapPaths(page)
  expect(paths.length).toBeGreaterThan(30)

  for (const path of paths) {
    const errors: string[] = []
    const onConsole = (msg: { type(): string; text(): string; location(): { url: string } }) => {
      if (msg.type() !== 'error') return
      const where = `${msg.text()} ${msg.location().url}`
      if (!IGNORED_CONSOLE.some((re) => re.test(where))) errors.push(where)
    }
    page.on('console', onConsole)

    const res = await page.goto(path)
    expect(res?.status(), path).toBe(200)
    await expect(page.locator('h1'), path).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]'), path).toHaveCount(1)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `${path} scrolls horizontally`).toBeLessThanOrEqual(0)

    page.off('console', onConsole)
    expect(errors, path).toEqual([])
  }
})

test('every tool page shows the learning note', async ({ page }) => {
  for (const tool of TOOLS) {
    await page.goto(toolPath(tool))
    await expect(page.getByText(LEARNING_NOTE), toolPath(tool)).toBeVisible()
  }
})

test('percent error with accepted 0 shows an error, not NaN or Infinity', async ({ page }) => {
  await page.goto('/chemistry/percent-error-calculator')
  await page.locator('#pe-experimental').fill('5')
  await page.locator('#pe-accepted').fill('0')
  await expect(page.locator('[aria-live=polite]:visible')).toContainText('undefined when the accepted value is 0')
  const text = await page.locator('main').innerText()
  expect(text).not.toMatch(/NaN|Infinity/)
})

test('grade converter with an empty input shows no NaN', async ({ page }) => {
  await page.goto('/gpa/grade-converter')
  await page.locator('#grade-percent').fill('')
  await expect(page.locator('main')).not.toContainText('NaN')
})

test('ads.txt is 404 while the AdSense client is unset', async ({ page }) => {
  test.skip(!!process.env.NEXT_PUBLIC_ADSENSE_CLIENT, 'AdSense client configured')
  const res = await page.request.get('/ads.txt')
  expect(res.status()).toBe(404)
})

test('formula and sig-fig fields are not auto-capitalized or autocorrected on phones', async ({ page }) => {
  // iOS capitalizes the first letter by default, turning co2 into Co2 (cobalt).
  for (const [path, id] of [
    ['/chemistry/grams-to-moles-calculator', '#gm-formula'],
    ['/chemistry/molarity-calculator', '#mo-formula'],
    ['/chemistry/sig-fig-calculator', '#sf-count'],
  ]) {
    await page.goto(path)
    const input = page.locator(id).first()
    await expect(input, path).toHaveAttribute('autocapitalize', 'none')
    await expect(input, path).toHaveAttribute('autocorrect', 'off')
  }
})

test('percent error Auto rounding applies the subtraction rule (52.3 vs 50.0 → 4.6%)', async ({ page }) => {
  await page.goto('/chemistry/percent-error-calculator')
  const panel = page.locator('[aria-live=polite]:visible')
  await expect(panel).toContainText('4.6%')
  await expect(panel).not.toContainText('4.60%')
})
