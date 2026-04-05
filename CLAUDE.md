# ROI Calculator — Claude Code Guide

## Project Context

React 18 + Vite 6 single-page app. Fully featured ROI calculator with dual-scenario comparison,
multi-currency support, PDF export, dark mode, embeddable widget, and a complete CI pipeline.
Feature requirements are in `AGENTS.md` — read it before implementing anything.

## Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18 (JSX, functional components, hooks) |
| Build tool | Vite 6 |
| Charting | Recharts 2 |
| Styling | Inline styles / CSS custom properties (no CSS framework) |
| Package manager | npm |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright (Chromium) |
| E2E coverage | nyc / Istanbul via `vite-plugin-istanbul` |
| Accessibility | axe-core via `@axe-core/playwright` |
| Performance | Lighthouse CI (`@lhci/cli`) |

## Commands

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` → http://localhost:5173 |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Install deps | `npm install` |
| Unit tests | `npm test` |
| Unit tests + coverage | `npm run test:coverage` |
| E2E tests | `npm run test:e2e` |
| E2E tests with coverage instrumentation | `npm run test:e2e:coverage` |
| Accessibility tests | `npm run test:a11y` |
| Build with Istanbul instrumentation | `npm run build:coverage` |
| Generate E2E coverage report | `npm run report:e2e:coverage` |
| Check E2E coverage threshold | `npm run check:e2e:coverage` |
| Full E2E coverage pipeline | `npm run e2e:coverage` |
| Lighthouse CI | `npm run test:lighthouse` |
| Vulnerability scan | `npm audit` |

## Project Structure

```
src/
  main.jsx              # ReactDOM.createRoot entry point
  App.jsx               # Root — state, dark mode, embed modal, export PDF, layout
  App.css               # All styles (CSS custom properties, dark theme overrides)
  components/
    InputForm.jsx         # Form inputs, currency labels, save/load buttons
    Results.jsx           # Results grid (disabled when invalid)
    CashFlowChart.jsx     # Dual-line Recharts chart (darkMode, currency props)
    BreakdownTable.jsx    # Monthly table with show/hide toggle
    EmbedModal.jsx        # Embed iframe code modal dialog
  utils/
    calculations.js       # Pure ROI calculation function
    validation.js         # validateInputs(), hasErrors()
    exportPdf.js          # exportToPDF(element) — html2canvas + jspdf
    currency.js           # CURRENCIES array, formatCurrency(), getCurrencySymbol()
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
  app.spec.js             # Playwright behavioural suite (63 tests)
  accessibility.spec.js   # WCAG 2.1 AA axe-core suite (9 tests)
  fixtures.js             # Custom fixture — auto-saves Istanbul coverage
scripts/
  collect-metrics.js      # SDLC metrics collector — writes metrics/roi-calculator.json
playwright.config.js      # Playwright config for E2E + coverage runs (port 4173)
playwright.a11y.config.js # Playwright config for a11y — writes test-results/a11y-results.json
.lighthouserc.json        # Lighthouse CI thresholds (Perf ≥80, A11y ≥90, BP ≥80)
.nycrc.json               # nyc E2E coverage config (79% threshold, json-summary reporter)
```

## Critical Rules

- **Always read `AGENTS.md`** before implementing features — it defines all requirements
- **Every build must pass all 5 checks** (unit tests + coverage, E2E tests, accessibility, vulnerability scan, library audit) — see `AGENTS.md` Non-Functional Mandates section
- **Functional components only** — no class components
- **No external UI libraries** (no MUI, Tailwind, Bootstrap) — use inline styles or plain CSS
- **Recharts is already installed** — use it for all charts, do not add other chart libraries
- **Mobile-first layout**: two-column on desktop, single-column on mobile (≤768px)
- **Do not modify** `main.jsx` unless the entry point itself needs to change
- **Run `npm run dev`** after significant changes to verify the app starts without errors

## Coding Conventions

- One component per file, named with PascalCase matching the filename
- Format currency using `formatCurrency(value, currency)` from `src/utils/currency.js` — do not use raw `toLocaleString` in components; multi-currency support requires the shared util
- Keep calculation logic in a pure function (no side effects), separate from render logic
- Props over state when data flows one direction
- All theme colours as CSS custom properties in `:root` / `[data-theme="dark"]` — no inline hex in components (chart colour props excepted)

## Examples

**Adding a new component**
```
✅ DO:  Create src/components/InputForm.jsx — one component, PascalCase filename
❌ DON'T: Add multiple components to App.jsx or use lowercase filenames
```

**Displaying a currency value**
```
✅ DO:  {formatCurrency(value, currency)}  ← from src/utils/currency.js
❌ DON'T: {value.toLocaleString('en-US', ...)}  ← bypasses multi-currency support
```

**Calculation logic**
```
✅ DO:  const results = calculateROI(inputs)  ← pure function in utils/calculations.js
❌ DON'T: Compute ROI inline inside a component or inside a useEffect
```

**Adding a chart**
```
✅ DO:  Use <LineChart> from recharts (already installed)
❌ DON'T: npm install chart.js or any other chart library
```

## Guides

@guides/recharts-patterns.md

## Key Feature Checklist (from AGENTS.md)

- [x] Input form: Initial Investment, Monthly Revenue, Monthly Costs, Period (12/24/36 mo)
- [x] Calculations: ROI %, payback period (months), total net profit, monthly cash flow array
- [x] Results panel: formatted ROI %, payback period, net profit
- [x] Recharts line chart: cumulative cash flow with dashed $0 break-even reference line
- [x] Layout: two-column (form left, results+chart right), collapses to single on mobile
- [x] Comparison mode: Scenario A (blue) + Scenario B (orange) on same chart
- [x] Input validation: red border + inline error, results/chart disabled until valid
- [x] Monthly breakdown table: show/hide toggle, striped rows, break-even row highlighted green
- [x] PDF export: html2canvas + jspdf, A4, dated filename, loading state
- [x] Dark theme: CSS custom properties, persisted to localStorage, WCAG AA contrast
- [x] Embeddable widget: iframe snippet modal with copy-to-clipboard
- [x] Chart animation: 600ms ease-out on both lines
- [x] Multi-currency: USD / EUR / RUB, persisted to localStorage, all displays updated
- [x] Save / Load scenarios: localStorage per scenario, Load disabled until saved
