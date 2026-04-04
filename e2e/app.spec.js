import { test, expect } from './fixtures.js'

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

  test('setting monthly revenue to 0 shows validation error', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-monthlyRevenue').fill('0')
    await expect(page.getByText('Must be greater than $0').first()).toBeVisible()
  })

  test('setting monthly costs to 0 shows validation error', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-monthlyCosts').fill('0')
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

  test('both scenarios invalid shows chart disabled message', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('0')
    await page.locator('#\\Scenario\\ B-initialInvestment').fill('0')
    await expect(page.getByText('Fix the errors above to see the chart')).toBeVisible()
  })

  // ── Results edge cases ────────────────────────────────────────────────────
  test('payback shown as Never when costs exceed revenue', async ({ page }) => {
    // monthlyNetProfit = 4000 - 5000 = -1000 → paybackPeriod = null
    await page.locator('#\\Scenario\\ A-monthlyRevenue').fill('4000')
    await expect(page.locator('.accent-a').getByText('Never')).toBeVisible()
  })

  test('payback shown as beyond period when payback exceeds selected period', async ({ page }) => {
    // monthlyNetProfit = 5001 - 5000 = 1 → payback = 100000 months >> 12
    await page.locator('#\\Scenario\\ A-monthlyRevenue').fill('5001')
    await expect(page.locator('.accent-a').getByText(/beyond period/)).toBeVisible()
  })

  test('negative ROI shown when investment exceeds total profit', async ({ page }) => {
    // 10000 * 12 - 200000 = -80000 → ROI = -40%
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('200000')
    await expect(page.locator('.accent-a .result-value.negative').first()).toBeVisible()
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

  // ── Dark theme ────────────────────────────────────────────────────────────
  test('dark theme toggle button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /dark/i })).toBeVisible()
  })

  test('clicking dark theme toggle sets data-theme="dark" on html element', async ({ page }) => {
    await page.getByRole('button', { name: /dark/i }).click()
    const theme = await page.evaluate(() => document.documentElement.dataset.theme)
    expect(theme).toBe('dark')
  })

  test('dark theme toggle label changes to Light after switching', async ({ page }) => {
    await page.getByRole('button', { name: /dark/i }).click()
    await expect(page.getByRole('button', { name: /light/i })).toBeVisible()
  })

  test('clicking light theme toggle switches back to light mode', async ({ page }) => {
    await page.getByRole('button', { name: /dark/i }).click()
    await page.getByRole('button', { name: /light/i }).click()
    const theme = await page.evaluate(() => document.documentElement.dataset.theme)
    expect(theme).toBe('')
  })

  test('dark mode persists after page reload via localStorage', async ({ page }) => {
    await page.getByRole('button', { name: /dark/i }).click()
    await page.reload()
    const theme = await page.evaluate(() => document.documentElement.dataset.theme)
    expect(theme).toBe('dark')
    // reset localStorage so other tests are not affected
    await page.evaluate(() => localStorage.removeItem('theme'))
  })

  // ── Embed widget ──────────────────────────────────────────────────────────
  test('Embed button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /embed/i })).toBeVisible()
  })

  test('clicking Embed button opens the modal dialog', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: /embed calculator/i })).toBeVisible()
  })

  test('embed modal shows an iframe code snippet', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    const code = await page.locator('.embed-code').inputValue()
    expect(code).toContain('<iframe')
    expect(code).toContain('ROI Calculator')
    expect(code).toContain('</iframe>')
  })

  test('embed modal code contains the current page origin', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    const origin = new URL(page.url()).origin
    const code = await page.locator('.embed-code').inputValue()
    expect(code).toContain(origin)
  })

  test('embed modal closes when the ✕ button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    await page.getByRole('button', { name: /close/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('embed modal closes when the overlay is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    // click the overlay area (top-left corner, outside the modal box)
    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Copy Code button shows Copied! feedback', async ({ page }) => {
    await page.getByRole('button', { name: /embed/i }).click()
    await page.getByRole('button', { name: /copy code/i }).click()
    await expect(page.getByRole('button', { name: /copied/i })).toBeVisible()
  })

  // ── Export PDF ────────────────────────────────────────────────────────────
  test('Export PDF button is visible in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export pdf/i })).toBeVisible()
  })

  test('clicking Export PDF triggers a file download with correct filename', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.getByRole('button', { name: /export pdf/i }).click(),
    ])
    expect(download.suggestedFilename()).toMatch(/^roi-analysis-\d{4}-\d{2}-\d{2}\.pdf$/)
  }, 65000)

  // ── Currency ──────────────────────────────────────────────────────────────
  test('currency selector is visible in the header', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: /select currency/i })).toBeVisible()
  })

  test('switching to EUR updates InputForm labels', async ({ page }) => {
    await page.getByRole('combobox', { name: /select currency/i }).selectOption('EUR')
    await expect(page.locator('label').filter({ hasText: /Initial Investment \(€\)/i }).first()).toBeVisible()
  })

  test('switching to EUR updates Results values to contain €', async ({ page }) => {
    await page.getByRole('combobox', { name: /select currency/i }).selectOption('EUR')
    await expect(page.locator('.accent-a .results-grid').getByText(/€/).first()).toBeVisible()
  })

  test('switching to RUB updates labels to ₽', async ({ page }) => {
    await page.getByRole('combobox', { name: /select currency/i }).selectOption('RUB')
    await expect(page.locator('label').filter({ hasText: /₽/ }).first()).toBeVisible()
  })

  test('currency persists to localStorage after selection', async ({ page }) => {
    await page.getByRole('combobox', { name: /select currency/i }).selectOption('EUR')
    const stored = await page.evaluate(() => localStorage.getItem('currency'))
    expect(stored).toBe('EUR')
    // reset
    await page.evaluate(() => localStorage.removeItem('currency'))
  })

  // ── Save / Load ───────────────────────────────────────────────────────────
  test('Save and Load buttons are visible in Scenario A form', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Scenario A inputs' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Load saved Scenario A inputs' })).toBeVisible()
  })

  test('Load button is disabled initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Load saved Scenario A inputs' })).toBeDisabled()
  })

  test('clicking Save enables the Load button', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('roi-saved-Scenario A'))
    await page.getByRole('button', { name: 'Save Scenario A inputs' }).click()
    await expect(page.getByRole('button', { name: 'Load saved Scenario A inputs' })).toBeEnabled()
    await page.evaluate(() => localStorage.removeItem('roi-saved-Scenario A'))
  })

  test('Load restores previously saved custom values', async ({ page }) => {
    // Change Scenario A investment, save, change again, then load
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('55555')
    await page.getByRole('button', { name: 'Save Scenario A inputs' }).click()
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('99999')
    await page.getByRole('button', { name: 'Load saved Scenario A inputs' }).click()
    await expect(page.locator('#\\Scenario\\ A-initialInvestment')).toHaveValue('55555')
    await page.evaluate(() => localStorage.removeItem('roi-saved-Scenario A'))
  })

  test('saves are independent between Scenario A and Scenario B', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('roi-saved-Scenario A')
      localStorage.removeItem('roi-saved-Scenario B')
    })
    await page.getByRole('button', { name: 'Save Scenario A inputs' }).click()
    await expect(page.getByRole('button', { name: 'Load saved Scenario B inputs' })).toBeDisabled()
    await page.evaluate(() => {
      localStorage.removeItem('roi-saved-Scenario A')
      localStorage.removeItem('roi-saved-Scenario B')
    })
  })

  test('saved scenario persists after page reload', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('roi-saved-Scenario A'))
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('77777')
    await page.getByRole('button', { name: 'Save Scenario A inputs' }).click()
    await page.reload()
    await expect(page.getByRole('button', { name: 'Load saved Scenario A inputs' })).toBeEnabled()
    await page.evaluate(() => localStorage.removeItem('roi-saved-Scenario A'))
  })
})
