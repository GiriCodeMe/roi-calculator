import { test as base, expect } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'fs'

export const test = base.extend({
  // Automatically saves Istanbul coverage from window.__coverage__ after every test
  autoSaveCoverage: [async ({ page }, use, testInfo) => {
    await use()
    if (process.env.VITE_COVERAGE === 'true') {
      const coverage = await page.evaluate(() => window.__coverage__ ?? null)
      if (coverage) {
        mkdirSync('.nyc_output', { recursive: true })
        const slug = testInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        writeFileSync(
          `.nyc_output/coverage-${slug}-${Date.now()}.json`,
          JSON.stringify(coverage)
        )
      }
    }
  }, { auto: true }],
})

export { expect }
