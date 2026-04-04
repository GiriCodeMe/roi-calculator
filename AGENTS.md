# ROI Calculator — Feature Requirements

## Completed Features

1. **Input form** — 4 fields per scenario: Initial Investment (default $100,000), Monthly Revenue (default $15,000), Monthly Costs (default $5,000), Calculation Period (12/24/36 months dropdown).
2. **Calculation logic** — ROI percentage, payback period in months, total net profit, month-by-month cumulative cash flow. Pure function in `src/utils/calculations.js`.
3. **Results panel** — ROI %, payback period, total net profit, monthly net profit. All values formatted with `toLocaleString`. Positive values green, negative red.
4. **Recharts line chart** — Cumulative cash flow over the selected period with a dashed $0 break-even reference line. Wrapped in `<ResponsiveContainer>`.
5. **Comparison mode** — Two scenarios (A and B) always visible side by side. Scenario A: blue accent (#2563eb). Scenario B: orange accent (#ea580c). Single chart with two colored lines and a legend.
6. **Input validation** — All fields (Initial Investment, Monthly Revenue, Monthly Costs) must be > 0. Invalid fields show a red border and an error message below. Results panel and chart line are disabled until the scenario's inputs are valid.
7. **Monthly breakdown table** — Below the chart, one table per scenario. Columns: Month, Monthly Revenue, Monthly Costs, Net Profit. Striped rows. Break-even month highlighted green. Hidden by default behind a "Show Table" / "Hide Table" toggle button.
8. **Export to PDF** — "⬇ Export PDF" button in the header. Captures `app-main` via `html2canvas` (scale 1.5) and generates an A4 PDF using `jspdf`. PDF includes "ROI Analysis Report" heading (blue), current date, horizontal rule, then the screenshot. Downloads as `roi-analysis-YYYY-MM-DD.pdf`. Button shows "⏳ Exporting…" while generating. `aria-label="Export PDF"`.
9. **Dark theme** — "🌙 Dark" / "☀ Light" toggle in the header. All colours defined as CSS custom properties in `:root`; overridden in `[data-theme="dark"]` on `<html>`. Persisted to `localStorage` under key `theme`. Chart axis, grid, tooltip, and reference-line colours switch via `darkMode` prop on `CashFlowChart`. All dark-mode colours meet WCAG 2.1 AA contrast ratios.
10. **Embeddable widget** — "＜/＞ Embed" button in the header opens a modal dialog. Modal shows a copyable `<iframe>` snippet using `window.location.origin`. "Copy Code" button copies to clipboard; shows "✓ Copied!" feedback for 2 s. Modal closes on overlay click or ✕ button. `role="dialog"` with `aria-modal` and `aria-labelledby`.
11. **Chart animation** — Both `<Line>` components in `CashFlowChart` use `isAnimationActive={true}`, `animationDuration={600}`, `animationEasing="ease-out"`, `animationBegin={0}` for a smooth draw-on-load effect.
12. **Multi-currency** — Currency selector (`<select>`) in the header persists choice to `localStorage` under key `currency`. Three options: USD (`$`), EUR (`€`), RUB (`₽`). All monetary values in InputForm labels, Results, BreakdownTable, and chart tooltip/Y-axis update to the selected currency via `src/utils/currency.js` (`CURRENCIES`, `formatCurrency`, `getCurrencySymbol`).
13. **Save scenarios** — Each InputForm has "💾 Save" and "Load" buttons. Clicking Save stores current inputs as JSON to `localStorage` under key `roi-saved-{label}`. Load is disabled until a save exists; clicking it restores the saved inputs via `onChange`. Both buttons have `aria-label` attributes. Styled with `.scenario-btn` class.

## Layout

- Header: title + subtitle (left) | action buttons — Currency selector, Dark/Light, Export PDF, Embed (right)
- Three stacked sections: inputs row → results row → chart → tables row
- Each row shows Scenario A (left) and Scenario B (right) side by side
- Collapses to single column on mobile (≤768px); header wraps to column on mobile

## File Structure

```
src/
  App.jsx                      # Root — state, dark mode, embed modal, export PDF, layout
  App.css                      # All styles (CSS custom properties, dark theme overrides)
  components/
    InputForm.jsx               # Form inputs, currency labels, save/load buttons
    Results.jsx                 # Results grid (disabled state when invalid)
    CashFlowChart.jsx           # Dual-line Recharts chart (darkMode, currency props)
    BreakdownTable.jsx          # Monthly table with show/hide toggle
    EmbedModal.jsx              # Embed iframe code modal dialog
  utils/
    calculations.js             # Pure ROI calculation function
    validation.js               # validateInputs(), hasErrors()
    exportPdf.js                # exportToPDF(element) — html2canvas + jspdf
    currency.js                 # CURRENCIES array, formatCurrency(), getCurrencySymbol()
  test/
    App.test.jsx
    InputForm.test.jsx
    Results.test.jsx
    CashFlowChart.test.jsx
    BreakdownTable.test.jsx
    EmbedModal.test.jsx
    exportPdf.test.js
    calculations.test.js
    validation.test.js
    currency.test.js
e2e/
  app.spec.js                  # Playwright behavioural test suite (60 tests)
  accessibility.spec.js        # WCAG 2.1 AA axe-core tests (8 tests)
  fixtures.js                  # Custom test fixture — auto-saves Istanbul coverage
playwright.config.js           # Playwright config — Chromium, port 4173, webServer
.lighthouserc.json             # Lighthouse CI thresholds (Perf ≥80, A11y ≥90, BP ≥80)
.nycrc.json                    # nyc E2E coverage config (79% threshold)
```

## Non-Functional Mandates — Run on Every Build

**When the instruction is "build" (or any feature implementation), always run all five checks below in order before considering the task done. A build is not complete until all five pass.**

| # | Check | Command | Pass Condition |
|---|-------|---------|----------------|
| 1 | **Unit tests + coverage** | `npm run test:coverage` | All tests pass + ≥95% on all metrics |
| 2 | **E2E tests** | `npm run build && npm run test:e2e` | All 60 Playwright behavioural tests pass |
| 3 | **Accessibility** | `npm run test:a11y` | 0 axe-core WCAG 2.1 AA violations |
| 4 | **Vulnerability scan** | `npm audit` | `found 0 vulnerabilities` |
| 5 | **Library audit** | `npm audit` | No high or critical severity advisories |

### Rules

- If any check fails, **fix the issue before marking the build done** — do not skip or defer.
- When adding a new util or component, write at least one unit test for it in the same build step.
- When adding new UI behaviour (new page element, interaction, or validation), add an E2E test in `e2e/app.spec.js`.
- When adding new visible elements, verify WCAG 2.1 AA colour contrast (≥4.5:1 for normal text) before committing.
- E2E tests require a production build (`npm run build`) before running — `npm run test:e2e` starts `npm run preview` automatically via `playwright.config.js`.
- Never use `npm audit --force` or `npm audit fix --force` without confirming with the user.
- Report all five check results to the user at the end of every build in this format:

```
✅ Unit tests + coverage — 90/90 passed, 100% stmts / 96.87% branches
✅ E2E tests             — 47/47 passed
✅ Accessibility         — 0 WCAG 2.1 AA violations
✅ npm audit             — 0 vulnerabilities
✅ Lib audit             — 0 high/critical advisories
```

## CI Gates (`.github/workflows/ci.yml`)

12 gates run automatically on every push/PR to `main`:

| Gate | Check | Threshold |
|------|-------|-----------|
| 1 | Build | Compiles without errors |
| 2 | Package (npm pack) | `.tgz` artifact produced |
| 3 | **Lighthouse** | Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 80 |
| 4 | **E2E Tests (Playwright)** | All 60 behavioural tests pass |
| 5 | **E2E Coverage** | > 79% statements / functions / branches / lines |
| 6 | **Accessibility — WCAG 2.1 AA** | 0 axe-core violations |
| 7 | Unit Tests & Coverage | 0 failures + ≥ 95% on all metrics |
| 8 | Code Lint (ESLint) | 0 errors |
| 9 | Library Audit | All advisories reported |
| 10 | Vulnerability Check | No moderate / high / critical vulnerabilities |
| 11 | SonarQube Scan | Disabled — enable by adding `SONAR_TOKEN` secret |
| 12 | SonarQube Quality Gate | Disabled — enable by adding `SONAR_TOKEN` secret |

A Go/No-Go report is written to the GitHub Actions Job Summary after every run, with collapsible sections for Unit, E2E, Accessibility, and Lighthouse results. If any gate fails, the job exits non-zero (**No-Go**).

## Design Tokens

### Light Theme (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f1f5f9` | Page background |
| `--bg-card` | `#ffffff` | Card / modal background |
| `--bg-alt` | `#f8fafc` | Result tiles, table stripe |
| `--text` | `#1e293b` | Primary text |
| `--text-muted` | `#475569` | Labels, secondary text (6.98:1 on `--bg`) |
| `--positive` | `#15803d` | Positive ROI / profit (4.74:1 on `--bg-alt`) |
| `--negative` | `#dc2626` | Negative ROI / errors |
| `--break-even-bg` | `#dcfce7` | Break-even row background |
| `--break-even-text` | `#15803d` | Break-even row text |
| Scenario A accent | `#2563eb` | Border, focus ring, toggle button, chart line |
| Scenario B accent | `#ea580c` | Border, focus ring, chart line |
| Scenario B button | `#c2410c` | Toggle button text (5.17:1 on white) |

### Dark Theme (`[data-theme="dark"]`)

| Token | Value | Contrast |
|-------|-------|---------|
| `--bg` | `#0f172a` | — |
| `--bg-card` | `#1e293b` | — |
| `--bg-alt` | `#162032` | — |
| `--text` | `#f1f5f9` | 16.5:1 on `--bg` |
| `--text-muted` | `#94a3b8` | 5.14:1 on `--bg-card` |
| `--positive` | `#4ade80` | 7.8:1 on `--bg-card` |
| `--negative` | `#f87171` | 7.2:1 on `--bg-card` |
| `--break-even-bg` | `#14532d` | — |
| `--break-even-text` | `#4ade80` | 7.8:1 on `--break-even-bg` |
