# ROI Calculator — Claude Code Guide

## Project Context

React 18 + Vite 6 single-page app built for the Vibe-Coding Bootcamp.
Renders an ROI calculator with input form, results panel, and Recharts cash-flow chart.
Feature requirements are in `AGENTS.md` — read it before implementing anything.

## Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18 (JSX, functional components, hooks) |
| Build tool | Vite 6 |
| Charting | Recharts 2 |
| Styling | Inline styles / CSS files (no CSS framework) |
| Package manager | npm |

## Commands

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` → http://localhost:5173 |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Install deps | `npm install` |

## Project Structure

```
src/
  main.jsx          # ReactDOM.createRoot entry point
  App.jsx           # Root component
  App.css           # Root styles
  components/       # Feature components go here
```

## Critical Rules

- **Always read `AGENTS.md`** before implementing features — it defines all requirements
- **Functional components only** — no class components
- **No external UI libraries** (no MUI, Tailwind, Bootstrap) — use inline styles or plain CSS
- **Recharts is already installed** — use it for all charts, do not add other chart libraries
- **Mobile-first layout**: two-column on desktop, single-column on mobile (use CSS media queries or flexbox wrap)
- **Do not modify** `main.jsx` unless the entry point itself needs to change
- **Run `npm run dev`** after significant changes to verify the app starts without errors

## Coding Conventions

- One component per file, named with PascalCase matching the filename
- Format currency with `toLocaleString('en-US')` — no raw numbers in UI
- Keep calculation logic in a pure function (no side effects), separate from render logic
- Props over state when data flows one direction

## Key Feature Checklist (from AGENTS.md)

- [ ] Input form: Initial Investment, Monthly Revenue, Monthly Costs, Period (12/24/36 mo)
- [ ] Calculations: ROI %, payback period (months), total net profit, monthly cash flow array
- [ ] Results panel: formatted ROI %, payback period, net profit
- [ ] Recharts line chart: cumulative cash flow with dashed $0 break-even reference line
- [ ] Layout: two-column (form left, results+chart right), collapses to single on mobile
