# ROI Calculator

A production-grade business ROI calculator built with React 18 + Vite 6. Compare two investment
scenarios side by side, visualise cumulative cash flow, and export reports — all in the browser.

## Features

- **Dual-scenario comparison** — Scenario A (blue) and Scenario B (orange) side by side on a single chart
- **Real-time calculations** — ROI %, payback period, total net profit, monthly net profit; recalculates on every keystroke
- **Input validation** — red border + inline error; results and chart line suppressed per-scenario until valid
- **Cash flow chart** — Recharts dual-line chart with dashed break-even reference line and animated draw-on-load
- **Monthly breakdown table** — show/hide toggle; striped rows; break-even month highlighted green
- **PDF export** — full-page screenshot via html2canvas + jspdf; A4 portrait; dated filename
- **Dark theme** — CSS custom property tokens; WCAG 2.1 AA contrast in both modes; persisted to localStorage
- **Embeddable widget** — copy `<iframe>` snippet from a modal dialog
- **Multi-currency** — USD, EUR, RUB; all monetary displays update; persisted to localStorage
- **Save / Load scenarios** — localStorage per scenario; Load button disabled until a save exists
- **Responsive** — two-column on desktop, single-column on mobile (≤768px)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Unit tests | `npm test` |
| Unit tests + coverage | `npm run test:coverage` |
| E2E tests | `npm run test:e2e` |
| E2E tests + coverage | `npm run test:e2e:coverage` |
| Accessibility tests | `npm run test:a11y` |
| Full E2E coverage pipeline | `npm run e2e:coverage` |
| Lighthouse CI | `npm run test:lighthouse` |
| Vulnerability scan | `npm audit` |

## CI Pipeline

12 automated gates run on every push/PR to `main`:

| Gate | Check | Threshold |
|------|-------|-----------|
| 1 | Build | Compiles without errors |
| 2 | Package (npm pack) | `.tgz` artifact produced |
| 3 | Lighthouse | Perf ≥ 80 · A11y ≥ 90 · Best Practices ≥ 80 |
| 4 | E2E Tests | 63/63 Playwright tests pass |
| 5 | E2E Coverage | > 79% statements / functions / branches / lines |
| 6 | Accessibility | 0 axe-core WCAG 2.1 AA violations (9 tests) |
| 7 | Unit Tests + Coverage | 0 failures · ≥ 95% all metrics |
| 8 | ESLint | 0 errors |
| 9 | Library Audit | All advisories reported |
| 10 | Vulnerability Check | 0 moderate / high / critical |
| 11 | SonarQube Scan | Disabled — enable by adding `SONAR_TOKEN` secret |
| 12 | SonarQube Quality Gate | Disabled — enable by adding `SONAR_TOKEN` secret |

A Go / No-Go summary is written to the GitHub Actions Job Summary after every run.

Passing CI on `main` triggers a `publish-metrics` job that pushes a structured metrics snapshot
to the [ai-sdlc-dashboard](https://github.com/GiriCodeMe/ai-sdlc-dashboard) repo, which is
deployed as a GitHub Pages SDLC analytics dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, JSX, functional components |
| Build | Vite 6 |
| Charts | Recharts 2 |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright (Chromium) |
| E2E coverage | nyc / Istanbul (`vite-plugin-istanbul`) |
| Accessibility | axe-core via `@axe-core/playwright` |
| Performance | Lighthouse CI (`@lhci/cli`) |
| PDF | html2canvas + jspdf |
| Styling | CSS custom properties (no CSS framework) |

## Project Structure

```
src/
  App.jsx               # Root — state, dark mode, embed modal, PDF export
  App.css               # All styles + CSS custom property tokens
  components/
    InputForm.jsx         # Inputs, currency labels, save/load buttons
    Results.jsx           # Metrics grid
    CashFlowChart.jsx     # Dual-line animated chart
    BreakdownTable.jsx    # Monthly table with toggle
    EmbedModal.jsx        # Iframe snippet modal
  utils/
    calculations.js       # Pure ROI calculation function
    validation.js         # validateInputs(), hasErrors()
    exportPdf.js          # html2canvas + jspdf
    currency.js           # CURRENCIES, formatCurrency(), getCurrencySymbol()
e2e/
  app.spec.js             # Behavioural suite (63 tests)
  accessibility.spec.js   # WCAG 2.1 AA suite (9 tests)
  fixtures.js             # Istanbul coverage fixture
scripts/
  collect-metrics.js      # SDLC metrics collector
```
