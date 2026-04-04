import { test, expect } from '@playwright/test'

test.describe('ROI Calculator — Behavioural', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Page load ─────────────────────────────────────────────────────────────
  test('page title is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ROI Calculator' })).toBeVisible()
  })

  test('both scenario input forms are rendered', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Scenario A', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Scenario B', exact: true })).toBeVisible()
  })

  // ── Default values ────────────────────────────────────────────────────────
  test('Scenario A is pre-populated with default values', async ({ page }) => {
    await expect(page.locator('#\\Scenario\\ A-initialInvestment')).toHaveValue('100000')
    await expect(page.locator('#\\Scenario\\ A-monthlyRevenue')).toHaveValue('15000')
    await expect(page.locator('#\\Scenario\\ A-monthlyCosts')).toHaveValue('5000')
  })

  test('Scenario B is pre-populated with default values', async ({ page }) => {
    await expect(page.locator('#\\Scenario\\ B-initialInvestment')).toHaveValue('150000')
    await expect(page.locator('#\\Scenario\\ B-monthlyRevenue')).toHaveValue('20000')
    await expect(page.locator('#\\Scenario\\ B-monthlyCosts')).toHaveValue('7000')
  })

  // ── Results ───────────────────────────────────────────────────────────────
  test('results panels are displayed for both scenarios', async ({ page }) => {
    await expect(page.getByText('Scenario A — Results')).toBeVisible()
    await expect(page.getByText('Scenario B — Results')).toBeVisible()
  })

  test('Scenario A ROI is calculated correctly from defaults', async ({ page }) => {
    // 10000 * 12 - 100000 = 20000 → ROI = 20%
    await expect(page.getByText('20.0%')).toBeVisible()
  })

  test('Scenario A payback period is shown', async ({ page }) => {
    // 100000 / 10000 = 10 months
    await expect(page.getByText('10 months')).toBeVisible()
  })

  // ── Live recalculation ────────────────────────────────────────────────────
  test('changing investment recalculates results', async ({ page }) => {
    const input = page.locator('#\\Scenario\\ A-initialInvestment')
    await input.fill('50000')
    // 10000 * 12 - 50000 = 70000 → ROI = 140%
    await expect(page.getByText('140.0%')).toBeVisible()
  })

  test('changing period to 24 months updates results', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-period').selectOption('24')
    // 10000 * 24 - 100000 = 140000 → ROI = 140%
    await expect(page.getByText('140.0%')).toBeVisible()
  })

  // ── Validation ────────────────────────────────────────────────────────────
  test('setting investment to 0 shows validation error', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('0')
    await expect(page.getByText('Must be greater than $0').first()).toBeVisible()
  })

  test('results are hidden when Scenario A inputs are invalid', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('0')
    await expect(page.getByText('Fix the errors above to see results').first()).toBeVisible()
  })

  test('Scenario B results remain visible when only Scenario A is invalid', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('0')
    await expect(page.getByText('Scenario B — Results')).toBeVisible()
    // Scenario B ROI should still show
    await expect(page.locator('.accent-b .results-grid')).toBeVisible()
  })

  // ── Breakdown table ───────────────────────────────────────────────────────
  test('table is hidden by default', async ({ page }) => {
    await expect(page.getByRole('table').first()).not.toBeVisible()
  })

  test('"Show Table" button reveals the breakdown table', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    await expect(page.getByRole('table').first()).toBeVisible()
  })

  test('table shows correct column headers', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    await expect(page.getByRole('columnheader', { name: 'Month', exact: true })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Monthly Revenue' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Monthly Costs' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Net Profit' })).toBeVisible()
  })

  test('table has 12 rows for the default 12-month period', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    const rows = page.locator('.breakdown-table tbody tr')
    await expect(rows).toHaveCount(12)
  })

  test('changing period to 24 months updates table row count', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    await page.locator('#\\Scenario\\ A-period').selectOption('24')
    const rows = page.locator('.breakdown-table tbody tr')
    await expect(rows).toHaveCount(24)
  })

  test('"Hide Table" button hides the table again', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    await page.getByRole('button', { name: 'Hide Table' }).first().click()
    await expect(page.getByRole('table').first()).not.toBeVisible()
  })

  test('break-even row is highlighted in the table', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    // Payback = month 10 → 10th data row (index 9 in tbody)
    const breakEvenRow = page.locator('.breakdown-table tbody tr.break-even-row')
    await expect(breakEvenRow).toHaveCount(1)
  })
})
