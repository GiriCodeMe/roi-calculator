# ROI Calculator — Feature Requirements

## Completed Features

1. **Input form** — 4 fields per scenario: Initial Investment (default $100,000), Monthly Revenue (default $15,000), Monthly Costs (default $5,000), Calculation Period (12/24/36 months dropdown).
2. **Calculation logic** — ROI percentage, payback period in months, total net profit, month-by-month cumulative cash flow. Pure function in `src/utils/calculations.js`.
3. **Results panel** — ROI %, payback period, total net profit, monthly net profit. All values formatted with `toLocaleString`. Positive values green, negative red.
4. **Recharts line chart** — Cumulative cash flow over the selected period with a dashed $0 break-even reference line. Wrapped in `<ResponsiveContainer>`.
5. **Comparison mode** — Two scenarios (A and B) always visible side by side. Scenario A: blue accent (#2563eb). Scenario B: orange accent (#ea580c). Single chart with two colored lines and a legend.
6. **Input validation** — All fields (Initial Investment, Monthly Revenue, Monthly Costs) must be > 0. Invalid fields show a red border and an error message below. Results panel and chart line are disabled until the scenario's inputs are valid.
7. **Monthly breakdown table** — Below the chart, one table per scenario. Columns: Month, Monthly Revenue, Monthly Costs, Net Profit. Striped rows. Break-even month highlighted green. Hidden by default behind a "Show Table" / "Hide Table" toggle button.

## Layout

- Three stacked sections: inputs row → results row → chart → tables row
- Each row shows Scenario A (left) and Scenario B (right) side by side
- Collapses to single column on mobile (≤768px)

## File Structure

```
src/
  App.jsx                      # Root — state, validation, layout
  App.css                      # All styles
  components/
    InputForm.jsx               # Form inputs with validation error display
    Results.jsx                 # Results grid (disabled state when invalid)
    CashFlowChart.jsx           # Dual-line Recharts chart
    BreakdownTable.jsx          # Monthly table with show/hide toggle
  utils/
    calculations.js             # Pure ROI calculation function
    validation.js               # validateInputs(), hasErrors()
e2e/
  app.spec.js                  # Playwright behavioural test suite (19 tests)
playwright.config.js           # Playwright config — Chromium, port 4173, webServer
```

## Non-Functional Mandates — Run on Every Build

**When the instruction is "build" (or any feature implementation), always run all five checks below in order before considering the task done. A build is not complete until all five pass.**

| # | Check | Command | Pass Condition |
|---|-------|---------|----------------|
| 1 | **Unit tests** | `npm test` | All tests pass (0 failures) |
| 2 | **Test coverage** | `npm run test:coverage` | Every file in `src/utils/` and `src/components/` has at least one test; ≥95% on all metrics |
| 3 | **E2E tests** | `npm run test:e2e` | All 19 Playwright behavioural tests pass |
| 4 | **Vulnerability scan** | `npm audit` | `found 0 vulnerabilities` |
| 5 | **Library audit** | `npm audit` | No high or critical severity advisories |

### Rules

- If any check fails, **fix the issue before marking the build done** — do not skip or defer.
- When adding a new util or component, write at least one unit test for it in the same build step.
- When adding new UI behaviour (new page element, interaction, or validation), add an E2E test in `e2e/app.spec.js`.
- E2E tests require a production build (`npm run build`) before running — `npm run test:e2e` starts `npm run preview` automatically via `playwright.config.js`.
- Never use `npm audit --force` or `npm audit fix --force` without confirming with the user.
- Report all five check results to the user at the end of every build in this format:

```
✅ Unit tests   — 52/52 passed
✅ Coverage     — all components and utils covered (≥95%)
✅ E2E tests    — 19/19 passed
✅ npm audit    — 0 vulnerabilities
✅ Lib audit    — 0 high/critical advisories
```

## CI Gates (`.github/workflows/ci.yml`)

10 gates run automatically on every push/PR to `main`:

| Gate | Check | Threshold |
|------|-------|-----------|
| 1 | Build | Compiles without errors |
| 2 | Package (npm pack) | `.tgz` artifact produced |
| 3 | **E2E Tests (Playwright)** | All 19 behavioural tests pass |
| 4 | Unit Tests | 0 failures |
| 5 | Code Coverage | ≥ 95% statements / functions / branches / lines |
| 6 | Code Lint (ESLint) | 0 errors |
| 7 | Library Audit | All advisories reported |
| 8 | Vulnerability Check | No moderate / high / critical vulnerabilities |
| 9 | SonarQube Scan | Disabled — enable by adding `SONAR_TOKEN` secret |
| 10 | SonarQube Quality Gate | Disabled — enable by adding `SONAR_TOKEN` secret |

A Go/No-Go report is written to the GitHub Actions Job Summary after every run. If any gate fails, the job exits non-zero (**No-Go**).

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Scenario A accent | `#2563eb` | Border, focus ring, toggle button, chart line |
| Scenario B accent | `#ea580c` | Border, focus ring, toggle button, chart line |
| Positive value | `#16a34a` | ROI, net profit when ≥ 0 |
| Negative value | `#dc2626` | ROI, net profit when < 0, validation errors |
| Break-even row | `#dcfce7` bg / `#15803d` text | First month cumulative cash flow ≥ 0 |
