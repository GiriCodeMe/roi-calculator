#!/usr/bin/env node
/**
 * collect-metrics.js — SDLC Performance Matrix collector for roi-calculator.
 * Writes metrics/roi-calculator.json consumed by ai-sdlc-dashboard.
 *
 * Run inside the publish-metrics CI job after all gates have executed.
 * Requires: GITHUB_TOKEN, GITHUB_RUN_ID, GATE_BUILD, GATE_LINT, GATE_VULN, GATE_LIGHTHOUSE
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.warn(`  [readJson] ${filePath}: ${err.message}`)
    return null
  }
}

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
  } catch {
    return null
  }
}

async function fetchGitHub(path, token) {
  const url = `https://api.github.com${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) return null
  return res.json()
}

function isoWeek(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

function mock(value, unit, source = 'mock') {
  return { value, unit, source, is_mock: true }
}

function live(value, unit, source) {
  return { value, unit, source, is_mock: false }
}

// ── Environment ───────────────────────────────────────────────────────────────

const GITHUB_TOKEN   = process.env.GITHUB_TOKEN    || ''
const GITHUB_RUN_ID  = process.env.GITHUB_RUN_ID   || 'local'
const OWNER          = process.env.GITHUB_REPOSITORY_OWNER || 'GiriCodeMe'
const REPO_NAME      = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : 'roi-calculator'
const DASHBOARD_REPO = 'GiriCodeMe/ai-sdlc-dashboard'

const gateOutcome = (env) => (process.env[env] === 'success' ? 'pass' : 'fail')

// ── Unit test metrics (vitest) ────────────────────────────────────────────────

function collectUnitTests() {
  console.log('  Checking unit test artifacts...')
  const summary = readJson('coverage/coverage-summary.json')
  const results = readJson('test-results/vitest-results.json')
  console.log(`    coverage/coverage-summary.json : ${summary ? 'found' : 'MISSING'}`)
  console.log(`    test-results/vitest-results.json: ${results ? 'found' : 'MISSING'}`)

  const covTotal = summary?.total ?? {}
  const vitestTotal  = results?.numTotalTests  ?? null
  const vitestPassed = results?.numPassedTests ?? null
  const vitestFailed = results?.numFailedTests ?? null

  return {
    total:  vitestTotal  !== null ? live(vitestTotal,  'count', 'vitest-results.json')       : mock(0, 'count', 'vitest-results.json missing'),
    passed: vitestPassed !== null ? live(vitestPassed, 'count', 'vitest-results.json')       : mock(0, 'count', 'vitest-results.json missing'),
    failed: vitestFailed !== null ? live(vitestFailed, 'count', 'vitest-results.json')       : mock(0, 'count', 'vitest-results.json missing'),
    coverage_lines:      covTotal.lines?.pct      != null ? live(covTotal.lines.pct,      'percent', 'coverage-summary.json') : mock(0, 'percent', 'coverage-summary.json missing'),
    coverage_branches:   covTotal.branches?.pct   != null ? live(covTotal.branches.pct,   'percent', 'coverage-summary.json') : mock(0, 'percent', 'coverage-summary.json missing'),
    coverage_functions:  covTotal.functions?.pct  != null ? live(covTotal.functions.pct,  'percent', 'coverage-summary.json') : mock(0, 'percent', 'coverage-summary.json missing'),
    coverage_statements: covTotal.statements?.pct != null ? live(covTotal.statements.pct, 'percent', 'coverage-summary.json') : mock(0, 'percent', 'coverage-summary.json missing'),
  }
}

// ── E2E test metrics (playwright) ─────────────────────────────────────────────

function collectE2eTests() {
  console.log('  Checking E2E test artifacts...')
  const summary = readJson('coverage-e2e/coverage-summary.json')
  const results = readJson('test-results/playwright-results.json')
  console.log(`    coverage-e2e/coverage-summary.json    : ${summary ? 'found' : 'MISSING'}`)
  console.log(`    test-results/playwright-results.json  : ${results ? 'found' : 'MISSING'}`)

  // Playwright JSON reporter: stats.expected = passed, stats.unexpected = failed
  const stats    = results?.stats ?? {}
  const pwPassed = stats.expected   ?? null   // "expected" = tests that passed as expected
  const pwFailed = stats.unexpected ?? null   // "unexpected" = tests that failed
  const pwTotal  = pwPassed !== null && pwFailed !== null
    ? pwPassed + pwFailed + (stats.skipped ?? 0)
    : null

  const covTotal = summary?.total ?? {}

  return {
    total:  pwTotal  !== null ? live(pwTotal,  'count', 'playwright-results.json')  : mock(0, 'count', 'playwright-results.json missing'),
    passed: pwPassed !== null ? live(pwPassed, 'count', 'playwright-results.json')  : mock(0, 'count', 'playwright-results.json missing'),
    failed: pwFailed !== null ? live(pwFailed, 'count', 'playwright-results.json')  : mock(0, 'count', 'playwright-results.json missing'),
    coverage_lines:      covTotal.lines?.pct      != null ? live(covTotal.lines.pct,      'percent', 'coverage-e2e/coverage-summary.json') : mock(0, 'percent', 'coverage-e2e missing'),
    coverage_branches:   covTotal.branches?.pct   != null ? live(covTotal.branches.pct,   'percent', 'coverage-e2e/coverage-summary.json') : mock(0, 'percent', 'coverage-e2e missing'),
    coverage_functions:  covTotal.functions?.pct  != null ? live(covTotal.functions.pct,  'percent', 'coverage-e2e/coverage-summary.json') : mock(0, 'percent', 'coverage-e2e missing'),
    coverage_statements: covTotal.statements?.pct != null ? live(covTotal.statements.pct, 'percent', 'coverage-e2e/coverage-summary.json') : mock(0, 'percent', 'coverage-e2e missing'),
  }
}

// ── Lighthouse metrics ────────────────────────────────────────────────────────

function collectLighthouse() {
  const lhDir = '.lighthouseci'
  if (!fs.existsSync(lhDir)) return null

  const lhrFiles = fs.readdirSync(lhDir).filter(f => f.startsWith('lhr-') && f.endsWith('.json'))
  if (lhrFiles.length === 0) return null

  const lhr = readJson(path.join(lhDir, lhrFiles[0]))
  if (!lhr) return null

  const cats = lhr.categories ?? {}
  return {
    performance:     live(Math.round((cats.performance?.score   ?? 0) * 100), 'score', 'lighthouse'),
    accessibility:   live(Math.round((cats.accessibility?.score ?? 0) * 100), 'score', 'lighthouse'),
    best_practices:  live(Math.round((cats['best-practices']?.score ?? 0) * 100), 'score', 'lighthouse'),
    seo:             live(Math.round((cats.seo?.score ?? 0) * 100), 'score', 'lighthouse'),
  }
}

// ── Vulnerability check (npm audit) ──────────────────────────────────────────

function collectVulnCheck() {
  const raw = safeExec('npm audit --json')
  if (!raw) return { total: mock(0, 'count', 'npm audit unavailable'), gate: gateOutcome('GATE_VULN') }

  const audit = JSON.parse(raw)
  const meta  = audit.metadata ?? {}
  const vulns = meta.vulnerabilities ?? {}
  const total = (vulns.moderate ?? 0) + (vulns.high ?? 0) + (vulns.critical ?? 0)

  return {
    total:    live(total, 'count', 'npm audit --json'),
    moderate: live(vulns.moderate  ?? 0, 'count', 'npm audit --json'),
    high:     live(vulns.high      ?? 0, 'count', 'npm audit --json'),
    critical: live(vulns.critical  ?? 0, 'count', 'npm audit --json'),
    gate:     gateOutcome('GATE_VULN'),
  }
}

// ── Complex module count (orchestration) ─────────────────────────────────────

function countComplexModules() {
  const dir = 'src/components'
  if (!fs.existsSync(dir)) return { count: 0, ratio: 0 }

  const files = fs.readdirSync(dir, { recursive: true })
    .filter(f => f.endsWith('.jsx') || f.endsWith('.js'))

  let complexCount = 0
  let totalLines   = 0

  for (const file of files) {
    const fp      = path.join(dir, file)
    const content = fs.readFileSync(fp, 'utf8')
    const lines   = content.split('\n').length
    totalLines   += lines
    if (lines > 100) complexCount++
  }

  return { count: complexCount, totalLines }
}

// ── GitHub API: PR cycle time ─────────────────────────────────────────────────

async function collectPrCycleTime(token) {
  const prs = await fetchGitHub(
    `/repos/${OWNER}/${REPO_NAME}/pulls?state=closed&per_page=30`,
    token
  )
  if (!prs || prs.length === 0) return mock(0, 'hours', 'no closed PRs')

  const hours = prs
    .filter(pr => pr.merged_at)
    .map(pr => {
      const created = new Date(pr.created_at)
      const merged  = new Date(pr.merged_at)
      return (merged - created) / 3_600_000
    })

  if (hours.length === 0) return mock(0, 'hours', 'no merged PRs')

  const avg = hours.reduce((a, b) => a + b, 0) / hours.length
  return live(parseFloat(avg.toFixed(1)), 'hours', 'github-api-pulls')
}

// ── GitHub API: Activity (commits + PRs) ─────────────────────────────────────

async function collectActivity(token) {
  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const [commits, prs] = await Promise.all([
    fetchGitHub(`/repos/${OWNER}/${REPO_NAME}/commits?since=${since}&per_page=100`, token),
    fetchGitHub(`/repos/${OWNER}/${REPO_NAME}/pulls?state=all&per_page=100`, token),
  ])

  const commitCount = Array.isArray(commits) ? commits.length : 0
  const prCount     = Array.isArray(prs) ? prs.length : 0

  return {
    commits_last_30d: live(commitCount, 'count', 'github-api-commits'),
    prs_last_30d:     live(prCount,     'count', 'github-api-pulls'),
  }
}

// ── Fetch existing series from dashboard repo ─────────────────────────────────

async function fetchExistingSeries(token) {
  const apiPath = `/repos/${DASHBOARD_REPO}/contents/metrics/roi-calculator.json`
  const res = await fetchGitHub(apiPath, token)
  if (!res || !res.content) return { heatmap_series: [], dual_axis_series: [] }

  try {
    const decoded = Buffer.from(res.content, 'base64').toString('utf8')
    const existing = JSON.parse(decoded)
    return {
      heatmap_series:   Array.isArray(existing.heatmap_series)   ? existing.heatmap_series   : [],
      dual_axis_series: Array.isArray(existing.dual_axis_series) ? existing.dual_axis_series : [],
    }
  } catch {
    return { heatmap_series: [], dual_axis_series: [] }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const now    = new Date()
  const sprint = isoWeek(now)

  // Collect live data
  const unitTests  = collectUnitTests()
  const e2eTests   = collectE2eTests()
  const lighthouse = collectLighthouse()
  const vuln       = collectVulnCheck()
  const { count: complexModules, totalLines } = countComplexModules()
  const manualLines = totalLines - 0 // all lines counted as manual for now

  // GitHub API data
  const prCycleTime = await collectPrCycleTime(GITHUB_TOKEN)
  const activity    = await collectActivity(GITHUB_TOKEN)

  // Fetch existing series for append
  const { heatmap_series, dual_axis_series } = await fetchExistingSeries(GITHUB_TOKEN)

  // Mock constants (replaced when real APIs are available)
  const AI_ACCEPTANCE_RATE     = 72  // mock — replace with Copilot API
  const BOILERPLATE_REDUCTION  = 38  // mock — % lines AI-generated
  const FLOW_EFFICIENCY        = 0.61 // mock — value stream: VA/total time
  const AI_CHANGE_FAILURE_RATE = 2.1  // mock — DORA: AI-induced failures %
  const SECURITY_REMEDIATION   = 4.2  // mock — hours to resolve AI-flagged vuln
  const UNIT_COST_PER_FEATURE  = 12.50 // mock — USD
  const TOKEN_ROI              = 8.3   // mock — X return per token $
  const LABOR_ARBITRAGE_VALUE  = 1200  // mock — USD/month saved

  // Retention risk evaluation
  const high_ai_usage       = AI_ACCEPTANCE_RATE >= 70
  const high_failure_rate   = AI_CHANGE_FAILURE_RATE >= 5.0
  const ratio               = manualLines > 0 ? complexModules / manualLines : 0
  const low_orchestration   = ratio < 0.005
  const retention_flagged   = high_ai_usage && (high_failure_rate || low_orchestration)

  // Append sprint entry to series
  const newHeatmapEntry = {
    project: 'roi-calculator',
    sprint,
    ai_acceptance_rate:    AI_ACCEPTANCE_RATE,
    technical_debt_ratio:  0.08, // mock
  }

  const newDualAxisEntry = {
    sprint,
    pr_cycle_time_hours:       typeof prCycleTime.value === 'number' ? prCycleTime.value : 0,
    ai_induced_vulnerabilities: AI_CHANGE_FAILURE_RATE,
  }

  // Avoid duplicate sprint entries
  const updatedHeatmap   = [...heatmap_series.filter(e => !(e.project === 'roi-calculator' && e.sprint === sprint)),   newHeatmapEntry]
  const updatedDualAxis  = [...dual_axis_series.filter(e => e.sprint !== sprint), newDualAxisEntry]

  // ── Build final metrics object ──────────────────────────────────────────────
  const metrics = {
    meta: {
      project:        'roi-calculator',
      repo:           `${OWNER}/${REPO_NAME}`,
      collected_at:   now.toISOString(),
      ci_run_id:      GITHUB_RUN_ID,
      schema_version: '1.0.0',
    },

    tier1_input: {
      ai_acceptance_rate:    mock(AI_ACCEPTANCE_RATE, 'percent', 'copilot-api'),
      boilerplate_reduction: mock(BOILERPLATE_REDUCTION, 'percent', 'copilot-api'),
    },

    tier2_process: {
      pr_cycle_time:   prCycleTime,
      flow_efficiency: mock(FLOW_EFFICIENCY, 'ratio', 'linearb-api'),
    },

    tier3_output: {
      ai_change_failure_rate:    mock(AI_CHANGE_FAILURE_RATE, 'percent', 'dora-api'),
      security_remediation_speed: mock(SECURITY_REMEDIATION, 'hours', 'snyk-api'),
    },

    tier4_value: {
      unit_cost_per_feature:  mock(UNIT_COST_PER_FEATURE, 'USD', 'manual-estimate'),
      token_roi:              mock(TOKEN_ROI, 'ratio', 'manual-estimate'),
      labor_arbitrage_value:  mock(LABOR_ARBITRAGE_VALUE, 'USD/month', 'manual-estimate'),
    },

    space_framework: {
      satisfaction:  mock(4.1, 'score-5', 'survey'),
      performance:   mock(78,  'percent', 'dora'),
      activity:      {
        commits_last_30d: activity.commits_last_30d,
        prs_last_30d:     activity.prs_last_30d,
      },
      communication: mock(3.8, 'score-5', 'survey'),
      efficiency:    mock(0.71, 'ratio', 'manual-estimate'),
    },

    orchestration_value: {
      complex_modules_managed: live(complexModules, 'count', 'fs.readdirSync(src/components)'),
      manual_lines_written:    live(manualLines,    'count', 'fs.readdirSync(src/components)'),
      ratio:                   live(ratio,          'ratio', 'derived'),
    },

    retention_risk: {
      flagged: retention_flagged,
      evaluation: {
        high_ai_usage:         { value: high_ai_usage,     threshold: '>=70% acceptance' },
        high_failure_rate:     { value: high_failure_rate, threshold: '>=5% failure rate' },
        low_orchestration_value: { value: low_orchestration, threshold: '<0.005 ratio' },
      },
    },

    ci_native: {
      build_status: {
        value:    process.env.GATE_BUILD === 'success' ? 'pass' : 'fail',
        unit:     'status',
        source:   'github-actions',
        is_mock:  false,
      },
      unit_tests:  unitTests,
      e2e_tests:   e2eTests,
      a11y_tests:  mock(0, 'violations', 'axe-core'),
      lint_errors: {
        value:   process.env.GATE_LINT === 'success' ? 0 : -1,
        unit:    'count',
        source:  'eslint',
        is_mock: process.env.GATE_LINT === undefined,
      },
      vuln_check:  vuln,
      lighthouse:  lighthouse
        ? { ...lighthouse, is_mock: false }
        : {
            performance:    mock(0, 'score', 'lighthouse-artifact missing'),
            accessibility:  mock(0, 'score', 'lighthouse-artifact missing'),
            best_practices: mock(0, 'score', 'lighthouse-artifact missing'),
          },
    },

    heatmap_series:   updatedHeatmap,
    dual_axis_series: updatedDualAxis,
  }

  // Write output
  fs.mkdirSync('metrics', { recursive: true })
  fs.writeFileSync('metrics/roi-calculator.json', JSON.stringify(metrics, null, 2))
  console.log('metrics/roi-calculator.json written successfully')
  console.log(`  Sprint: ${sprint}`)
  console.log(`  Heatmap entries: ${updatedHeatmap.length}`)
  console.log(`  Dual-axis entries: ${updatedDualAxis.length}`)
  console.log(`  Retention risk flagged: ${retention_flagged}`)
}

main().catch(err => {
  console.error('collect-metrics.js failed:', err)
  process.exit(1)
})
