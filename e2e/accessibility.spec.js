import AxeBuilder from '@axe-core/playwright'
import { test, expect } from './fixtures.js'

test.describe('Accessibility — WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Full page scans ──────────────────────────────────────────────────────
  test('page has no automatically detectable WCAG violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('Scenario A input form has no accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.accent-a')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('Scenario B input form has no accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.accent-b')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  // ── Results panels ───────────────────────────────────────────────────────
  test('results panels have no accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.results-row')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  // ── Breakdown table ──────────────────────────────────────────────────────
  test('breakdown table has no accessibility violations when visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Show Table' }).first().click()
    const results = await new AxeBuilder({ page })
      .include('.tables-row')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  // ── Validation state ─────────────────────────────────────────────────────
  test('validation error state has no accessibility violations', async ({ page }) => {
    await page.locator('#\\Scenario\\ A-initialInvestment').fill('0')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  // ── Keyboard navigation ──────────────────────────────────────────────────
  test('all interactive elements are keyboard reachable', async ({ page }) => {
    const focusable = await page.evaluate(() => {
      const els = document.querySelectorAll(
        'input, select, button, a[href], [tabindex]:not([tabindex="-1"])'
      )
      return Array.from(els).map(el => ({
        tag: el.tagName,
        type: el.type || null,
        tabIndex: el.tabIndex,
      }))
    })
    // Every focusable element must have tabIndex >= 0
    const unreachable = focusable.filter(el => el.tabIndex < 0)
    expect(unreachable).toHaveLength(0)
  })

  test('form labels are associated with their inputs', async ({ page }) => {
    const unlabelled = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select')
      return Array.from(inputs)
        .filter(input => !input.labels || input.labels.length === 0)
        .map(input => ({ id: input.id, type: input.type }))
    })
    expect(unlabelled).toHaveLength(0)
  })

  // ── Dark mode ─────────────────────────────────────────────────────────────
  test('dark mode has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.getByRole('button', { name: /Switch to dark theme/i }).click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
    // reset so other tests are not affected
    await page.evaluate(() => localStorage.removeItem('theme'))
  })
})
