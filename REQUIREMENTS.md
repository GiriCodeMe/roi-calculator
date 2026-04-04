# ROI Calculator — Requirements Specification

_Version 1.1 | Updated: 2026-04-04_

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Personas](#2-personas)
3. [User Stories](#3-user-stories)
4. [User Journeys](#4-user-journeys)
5. [Functional Requirements](#5-functional-requirements)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Constraints & Assumptions](#8-constraints--assumptions)

> **v1.1 additions**: Epic 10 (Save Scenarios), Epic 11 (Chart Animation), Epic 12 (Multi-Currency); FR-11, FR-12, FR-13; AC-09, AC-10; updated assumptions for currency and data persistence.

---

## 1. Product Overview

The ROI Calculator is a browser-based single-page application that enables users to evaluate and compare the financial return on two investment scenarios simultaneously. It accepts four financial inputs per scenario, performs real-time calculations, visualises cumulative cash flow on a chart, and provides supporting tools for reporting (PDF export) and distribution (embeddable iframe widget).

**Primary value proposition**: Replace spreadsheet-based ROI modelling with an instant, visual, shareable tool that requires no financial expertise to operate.

---

## 2. Personas

### P1 — Sam, the Startup Founder

| Attribute | Detail |
|-----------|--------|
| **Role** | Founder evaluating whether to launch a new product line |
| **Goal** | Understand how long until the investment pays back and whether the margin justifies the risk |
| **Tech comfort** | Moderate — uses spreadsheets, not a developer |
| **Key frustration** | Building a new spreadsheet from scratch every time assumptions change |
| **Success metric** | Can enter numbers, understand the results, and share them with a co-founder in under 5 minutes |

### P2 — Jordan, the Financial Analyst

| Attribute | Detail |
|-----------|--------|
| **Role** | In-house analyst producing investment recommendation reports |
| **Goal** | Quickly prototype two capital allocation scenarios and include a snapshot in a slide deck |
| **Tech comfort** | High — comfortable with financial models and data tools |
| **Key frustration** | Manual screenshotting and formatting for client-ready reports |
| **Success metric** | Can export a clean, dated PDF without leaving the browser |

### P3 — Alex, the Business Consultant

| Attribute | Detail |
|-----------|--------|
| **Role** | External consultant facilitating investment workshops with multiple clients |
| **Goal** | Embed the calculator inside a client portal or microsite so clients can self-serve |
| **Tech comfort** | High — can copy an iframe snippet and paste it into a CMS |
| **Key frustration** | Directing clients to a separate tool breaks the flow of the portal experience |
| **Success metric** | Can retrieve the embed code and have the calculator live in their site within 10 minutes |

### P4 — Morgan, the Accessibility-Dependent User

| Attribute | Detail |
|-----------|--------|
| **Role** | Any user who relies on a screen reader, keyboard navigation, or high-contrast display |
| **Goal** | Use all features without requiring a mouse or relying on colour alone to convey meaning |
| **Tech comfort** | Varies |
| **Key frustration** | Financial tools that are keyboard-inaccessible or fail colour-contrast checks |
| **Success metric** | 0 WCAG 2.1 AA violations; all interactive elements reachable by Tab key with visible focus |

---

## 3. User Stories

### Epic 1 — Investment Input

| ID | Story | Priority |
|----|-------|----------|
| US-01 | As **Sam**, I want to enter an initial investment amount so that the calculator knows how much capital I am deploying. | Must |
| US-02 | As **Sam**, I want to enter expected monthly revenue so that the calculator can project income over time. | Must |
| US-03 | As **Sam**, I want to enter monthly operating costs so that profitability is reflected accurately. | Must |
| US-04 | As **Sam**, I want to select a calculation period (12, 24, or 36 months) so that I can model short- and long-term scenarios. | Must |
| US-05 | As **Sam**, I want the form to pre-populate with realistic default values so that I can understand the output format immediately without entering any data. | Should |
| US-06 | As **Sam**, I want to be told immediately when I enter an invalid value (e.g. $0 investment) so that I do not act on incorrect results. | Must |

### Epic 2 — Scenario Comparison

| ID | Story | Priority |
|----|-------|----------|
| US-07 | As **Jordan**, I want two independent input panels visible at the same time so that I can compare two investment options side by side without switching screens. | Must |
| US-08 | As **Jordan**, I want each scenario clearly colour-coded (blue vs orange) so that I can distinguish them at a glance in both the results panel and the chart. | Should |
| US-09 | As **Jordan**, I want each scenario to be independently validated so that a data-entry error in Scenario B does not prevent me from viewing valid results for Scenario A. | Must |

### Epic 3 — Results & Calculations

| ID | Story | Priority |
|----|-------|----------|
| US-10 | As **Sam**, I want to see the ROI percentage so that I can judge whether the return justifies the risk. | Must |
| US-11 | As **Sam**, I want to see the payback period in months so that I know how long before I recoup my investment. | Must |
| US-12 | As **Sam**, I want to see the total net profit for the selected period so that I understand the absolute gain or loss. | Must |
| US-13 | As **Sam**, I want to see the monthly net profit so that I understand the ongoing cash position each month. | Must |
| US-14 | As **Jordan**, I want positive values shown in green and negative values in red so that the financial health of a scenario is immediately obvious. | Should |
| US-15 | As **Sam**, I want all monetary values formatted with commas and the selected currency symbol (e.g. $1,234,567 or €1.234.567) so that large numbers are easy to read. | Must |

### Epic 4 — Cash Flow Visualisation

| ID | Story | Priority |
|----|-------|----------|
| US-16 | As **Jordan**, I want a line chart of cumulative cash flow over time so that I can see the trajectory of each investment. | Must |
| US-17 | As **Jordan**, I want a dashed break-even reference line at $0 on the chart so that I can instantly see when each scenario becomes profitable. | Must |
| US-18 | As **Sam**, I want both scenario lines on the same chart so that I can compare their trajectories directly. | Must |
| US-19 | As **Sam**, I want the chart to show only the valid scenario when one scenario has errors so that partial information is still accessible. | Should |
| US-20 | As **Morgan**, I want chart tooltips to display currency-formatted values on hover so that I can read precise values without relying solely on the visual line position. | Should |

### Epic 5 — Monthly Breakdown Table

| ID | Story | Priority |
|----|-------|----------|
| US-21 | As **Jordan**, I want a month-by-month table of Revenue, Costs, and Net Profit so that I can inspect the numbers behind the chart. | Should |
| US-22 | As **Jordan**, I want the break-even month highlighted in green in the table so that I can identify it without scanning every row. | Should |
| US-23 | As **Sam**, I want the table hidden by default so that the page is not overwhelming when I first arrive. | Could |
| US-24 | As **Sam**, I want a Show/Hide toggle button to reveal or collapse the table on demand. | Could |

### Epic 6 — PDF Export

| ID | Story | Priority |
|----|-------|----------|
| US-25 | As **Jordan**, I want to export the current state of the calculator to a PDF so that I can include it in a report or presentation. | Should |
| US-26 | As **Jordan**, I want the PDF to include a heading "ROI Analysis Report" and the current date so that the document is self-identifying. | Should |
| US-27 | As **Jordan**, I want the export button to show a loading state ("Exporting…") so that I know the PDF is being generated and do not click twice. | Could |
| US-28 | As **Jordan**, I want the PDF filename to include the date (e.g. `roi-analysis-2026-04-04.pdf`) so that I can file it without renaming it. | Could |

### Epic 7 — Dark Theme

| ID | Story | Priority |
|----|-------|----------|
| US-29 | As **Morgan**, I want to switch between a light and dark colour scheme so that I can use the calculator comfortably in low-light environments. | Should |
| US-30 | As **Sam**, I want my theme preference saved so that it is restored when I return to the page in the same browser. | Could |
| US-31 | As **Morgan**, I want all dark-mode colours to meet WCAG 2.1 AA contrast ratios so that the calculator remains legible in dark mode. | Must |

### Epic 8 — Embeddable Widget

| ID | Story | Priority |
|----|-------|----------|
| US-32 | As **Alex**, I want to obtain an iframe code snippet so that I can embed the calculator in my client's website. | Should |
| US-33 | As **Alex**, I want the iframe snippet to auto-populate with the correct current URL so that the embedded calculator points to the live instance without manual editing. | Should |
| US-34 | As **Alex**, I want a one-click "Copy Code" button so that I do not have to manually select and copy the snippet. | Should |
| US-35 | As **Alex**, I want visual confirmation ("✓ Copied!") after clicking copy so that I know the clipboard was written successfully. | Could |
| US-36 | As **Alex**, I want the embed modal to close when I click outside it or press the ✕ button so that I can dismiss it quickly. | Should |

### Epic 9 — Accessibility & Responsiveness

| ID | Story | Priority |
|----|-------|----------|
| US-37 | As **Morgan**, I want all form inputs to have visible, associated labels so that a screen reader announces what each field expects. | Must |
| US-38 | As **Morgan**, I want all buttons to have descriptive `aria-label` attributes so that icon-only or short-label buttons are understood by assistive technology. | Must |
| US-39 | As **Morgan**, I want to navigate and operate all features using only the keyboard so that the tool is usable without a mouse. | Must |
| US-40 | As **Sam**, I want the layout to work on a mobile phone so that I can check scenarios on the go. | Should |

### Epic 10 — Save Scenarios

| ID | Story | Priority |
|----|-------|----------|
| US-41 | As **Sam**, I want to save my current inputs for a scenario so that I can restore them after experimenting with different values. | Should |
| US-42 | As **Sam**, I want a "Load" button that is disabled until I have saved, so that I cannot accidentally load empty data. | Should |
| US-43 | As **Sam**, I want saves to be independent between Scenario A and Scenario B so that saving one does not affect the other. | Should |
| US-44 | As **Sam**, I want my saved scenario to persist after a page reload so that I do not lose my work between sessions. | Could |

### Epic 11 — Chart Animation

| ID | Story | Priority |
|----|-------|----------|
| US-45 | As **Jordan**, I want the cash flow lines to animate on load so that the chart feels polished and draws attention to the trajectory of each scenario. | Could |

### Epic 12 — Multi-Currency

| ID | Story | Priority |
|----|-------|----------|
| US-46 | As **Jordan**, I want to switch the display currency (USD, EUR, RUB) so that I can present scenarios in the currency relevant to my client. | Should |
| US-47 | As **Jordan**, I want all monetary values — form labels, results, table cells, and chart tooltips — to update when I change the currency so that the display is consistent throughout. | Should |
| US-48 | As **Sam**, I want my currency preference saved so that it is restored when I return to the page. | Could |

---

## 4. User Journeys

### Journey 1 — First-Time Evaluation (Sam, Startup Founder)

```
1. ARRIVE
   Sam opens the URL. The page loads with Scenario A and B pre-filled
   with realistic defaults. Results and a chart are immediately visible.
   No sign-up or configuration required.

2. ADJUST SCENARIO A
   Sam changes "Initial Investment" to $50,000 and "Monthly Revenue"
   to $8,000. Results update in real time. The chart redraws.

3. VALIDATE AWARENESS
   Sam accidentally clears "Monthly Costs" to 0. A red error message
   appears: "Must be greater than $0". The Scenario A results panel
   shows "Fix the errors above to see results". The Scenario A line
   disappears from the chart. Scenario B remains fully visible.

4. CORRECT ERROR
   Sam types 3000. The error clears, results reappear, and the chart
   line is restored.

5. COMPARE
   Sam looks at Scenario A (blue) vs Scenario B (orange) on the chart
   and in the results grid. Scenario B has a longer payback period but
   higher total net profit.

6. DRILL DOWN
   Sam clicks "Show Table" under Scenario A. The monthly breakdown
   appears. The break-even row (month 7) is highlighted in green.

7. DONE
   Sam shares the URL with a co-founder for async review.
```

---

### Journey 2 — Report Generation (Jordan, Financial Analyst)

```
1. ARRIVE & SET UP
   Jordan opens the calculator and enters two capital allocation
   scenarios received from the investment committee.

2. SWITCH THEME
   Jordan is presenting on a projector in a dark room. Clicks
   "🌙 Dark". The entire UI transitions to dark mode. The chart
   axes, tooltips, and grid lines all update. The setting is saved.

3. REVIEW RESULTS
   Jordan confirms the ROI % and payback period figures match
   those in the financial model spreadsheet. They match.

4. EXPORT PDF
   Jordan clicks "⬇ Export PDF". The button changes to "⏳ Exporting…"
   for ~2 seconds. A file named "roi-analysis-2026-04-04.pdf"
   downloads automatically. It contains a blue "ROI Analysis Report"
   heading, today's date, and a full-page screenshot of the calculator.

5. INSERT INTO DECK
   Jordan inserts the PDF page into the slide deck as an image.
   Done — no additional formatting needed.
```

---

### Journey 3 — Widget Embedding (Alex, Business Consultant)

```
1. ARRIVE
   Alex opens the deployed calculator URL (e.g. https://roi.example.com).

2. OPEN EMBED MODAL
   Alex clicks "</> Embed" in the header. A modal dialog opens with
   a read-only textarea containing:
     <iframe src="https://roi.example.com" width="1200" ...>

3. COPY SNIPPET
   Alex clicks "Copy Code". The button text changes to "✓ Copied!"
   for 2 seconds, then resets to "Copy Code".

4. PASTE INTO CMS
   Alex pastes the snippet into the HTML block of the client portal.
   The calculator renders inside the client's page at 1200×900px.

5. CLOSE MODAL
   Alex clicks the ✕ button (or clicks the overlay backdrop).
   The modal closes. Alex continues using the calculator normally.
```

---

### Journey 4 — Accessibility-Dependent Use (Morgan)

```
1. ARRIVE WITH SCREEN READER
   Morgan navigates to the page using a screen reader. The page
   title "ROI Calculator" is announced. All inputs are announced
   with their label text ("Initial Investment ($)").

2. KEYBOARD NAVIGATION
   Morgan uses Tab to move through all inputs, the period dropdown,
   the Dark/Light toggle, Export PDF, and Embed buttons.
   All elements receive visible focus indicators.

3. ERROR RECOVERY
   Morgan tabs to "Initial Investment", enters -100. An error message
   "Must be greater than $0" is rendered adjacent to the field and
   picked up by the screen reader on next focus.

4. DARK MODE
   Morgan activates "Switch to dark theme" (aria-label announced).
   All foreground/background colour combinations maintain ≥4.5:1 ratio.

5. EMBED MODAL
   Morgan activates "Get embed code". The modal is announced as
   role="dialog" with aria-modal="true". The heading "Embed Calculator"
   is associated via aria-labelledby. Morgan can close with Escape
   (focus returns to the trigger button).
```

---

## 5. Functional Requirements

### FR-01 Input Form

| ID | Requirement |
|----|-------------|
| FR-01.1 | The application shall provide two independent input panels labelled "Scenario A" and "Scenario B". |
| FR-01.2 | Each panel shall contain: Initial Investment ($), Expected Monthly Revenue ($), Monthly Operating Costs ($), and Calculation Period (months). |
| FR-01.3 | Calculation Period shall be a dropdown with options 12, 24, and 36 months. |
| FR-01.4 | Initial Investment, Monthly Revenue, and Monthly Costs shall accept numeric input only. |
| FR-01.5 | Each panel shall pre-populate with default values on page load (Scenario A: $100,000 / $15,000 / $5,000 / 12 mo; Scenario B: $150,000 / $20,000 / $7,000 / 12 mo). |
| FR-01.6 | All changes to inputs shall trigger recalculation and re-render with no user action required beyond data entry. |

### FR-02 Input Validation

| ID | Requirement |
|----|-------------|
| FR-02.1 | Initial Investment, Monthly Revenue, and Monthly Costs shall each be validated as a number greater than zero. |
| FR-02.2 | Each invalid field shall display a red border and an inline error message directly below the field. |
| FR-02.3 | Validation shall run on every change event (not just on blur or submit). |
| FR-02.4 | A scenario with any validation errors shall disable its Results panel and Breakdown Table, showing "Fix the errors above to see results". |
| FR-02.5 | A scenario with validation errors shall hide its line from the cash flow chart, but the other scenario's line shall remain. |
| FR-02.6 | When both scenarios are invalid, the chart area shall display "Fix the errors above to see the chart". |

### FR-03 Calculations

| ID | Requirement |
|----|-------------|
| FR-03.1 | Monthly Net Profit shall be calculated as: `Monthly Revenue − Monthly Costs`. |
| FR-03.2 | Total Net Profit shall be calculated as: `(Monthly Net Profit × Period) − Initial Investment`. |
| FR-03.3 | ROI (%) shall be calculated as: `(Total Net Profit / Initial Investment) × 100`. |
| FR-03.4 | Payback Period shall be calculated as: `⌈Initial Investment / Monthly Net Profit⌉` months. If Monthly Net Profit ≤ 0, Payback Period shall display "Never". |
| FR-03.5 | If Payback Period exceeds the selected period, the display shall read "{N} mo (beyond period)". |
| FR-03.6 | Cumulative Cash Flow for month M shall be: `(Monthly Net Profit × M) − Initial Investment`. |
| FR-03.7 | All calculations shall be pure functions with no side effects, isolated in `src/utils/calculations.js`. |

### FR-04 Results Panel

| ID | Requirement |
|----|-------------|
| FR-04.1 | The Results panel for each scenario shall display: ROI (%), Payback Period, Total Net Profit, Monthly Net Profit. |
| FR-04.2 | Monetary values shall be formatted as `$X,XXX` using `toLocaleString('en-US')`. |
| FR-04.3 | Positive monetary values and positive ROI shall be rendered in green (`--positive`). |
| FR-04.4 | Negative monetary values and negative ROI shall be rendered in red (`--negative`). |

### FR-05 Cash Flow Chart

| ID | Requirement |
|----|-------------|
| FR-05.1 | The chart shall plot cumulative cash flow (Y-axis, USD) against month number (X-axis) for each valid scenario. |
| FR-05.2 | Scenario A's line shall be rendered in blue (#2563eb); Scenario B's line in orange (#ea580c). |
| FR-05.3 | A dashed horizontal reference line at Y=0 shall be rendered and labelled "Break-even". |
| FR-05.4 | The chart shall include a legend identifying each scenario line. |
| FR-05.5 | Hovering over the chart shall show a tooltip with the month label and formatted dollar values for each visible scenario. |
| FR-05.6 | The Y-axis tick labels shall use abbreviated format (e.g. `$10k`, `$-5k`). |
| FR-05.7 | The chart shall be wrapped in `<ResponsiveContainer>` and fill 100% of its container width. |
| FR-05.8 | When scenarios have different periods, the shorter data shall be padded with nulls so the longer period determines the X-axis range. |

### FR-06 Monthly Breakdown Table

| ID | Requirement |
|----|-------------|
| FR-06.1 | A Breakdown Table shall be rendered below the chart for each scenario. |
| FR-06.2 | The table shall contain columns: Month, Monthly Revenue, Monthly Costs, Net Profit. |
| FR-06.3 | The table shall be hidden by default; a "Show Table" button shall reveal it. |
| FR-06.4 | The button shall toggle to "Hide Table" when the table is visible. |
| FR-06.5 | The row on which cumulative cash flow first becomes ≥ 0 (break-even month) shall be highlighted with a green background. |
| FR-06.6 | Table rows shall alternate background colours (striped). |
| FR-06.7 | The "Show Table" button shall be disabled when the scenario has validation errors. |

### FR-07 PDF Export

| ID | Requirement |
|----|-------------|
| FR-07.1 | A header button labelled "⬇ Export PDF" (`aria-label="Export PDF"`) shall trigger PDF generation. |
| FR-07.2 | The PDF shall capture the full `app-main` area (inputs, results, chart, and tables) via html2canvas at scale 1.5. |
| FR-07.3 | The PDF shall be A4 portrait format (210mm × 297mm, 15mm margins). |
| FR-07.4 | The PDF header shall include: title "ROI Analysis Report" (blue, 20pt bold), and a "Generated: {date}" subtitle (grey, 9pt), separated from the screenshot by a horizontal rule. |
| FR-07.5 | The screenshot image shall be scaled to fit within the available content area while preserving aspect ratio. |
| FR-07.6 | The exported filename shall follow the pattern `roi-analysis-YYYY-MM-DD.pdf`. |
| FR-07.7 | While export is in progress the button shall display "⏳ Exporting…" and be disabled to prevent double-clicks. |

### FR-08 Dark Theme

| ID | Requirement |
|----|-------------|
| FR-08.1 | A header button labelled "🌙 Dark" / "☀ Light" shall toggle dark and light themes. |
| FR-08.2 | Theme shall be applied via `data-theme="dark"` on the `<html>` element, using CSS custom property overrides. |
| FR-08.3 | The selected theme shall be persisted to `localStorage` under the key `theme` and restored on page load. |
| FR-08.4 | The chart's grid, axis, reference line, and tooltip colours shall update dynamically when the theme changes. |
| FR-08.5 | All dark-mode foreground/background colour pairs shall meet WCAG 2.1 AA minimum contrast ratio (≥4.5:1 for body text, ≥3:1 for large text). |

### FR-09 Embed Widget

| ID | Requirement |
|----|-------------|
| FR-09.1 | A header button labelled "</> Embed" shall open a modal dialog. |
| FR-09.2 | The modal shall display a read-only textarea containing a complete `<iframe>` snippet using the application's current `window.location.origin` + pathname. |
| FR-09.3 | The iframe snippet shall specify: `width="1200"`, `height="900"`, `frameborder="0"`, `title="ROI Calculator"`, `allow="clipboard-write"`. |
| FR-09.4 | A "Copy Code" button shall write the snippet to the clipboard. On success, the button shall display "✓ Copied!" for 2 seconds then reset. |
| FR-09.5 | If `navigator.clipboard.writeText` is unavailable or rejected, the fallback shall select the textarea content and invoke `document.execCommand('copy')`. |
| FR-09.6 | Clicking the textarea shall select all its content. |
| FR-09.7 | The modal shall close when the overlay backdrop is clicked or the ✕ button is clicked. |
| FR-09.8 | The modal shall have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to its heading element. |

### FR-10 Layout & Responsiveness

| ID | Requirement |
|----|-------------|
| FR-10.1 | The page header shall display the title and subtitle on the left and four controls (Currency selector, Dark/Light, Export PDF, Embed) on the right. |
| FR-10.2 | Scenario A and B input panels shall be side by side (two-column) on viewport widths > 768px. |
| FR-10.3 | On viewport widths ≤ 768px, all sections shall collapse to a single-column stacked layout. |
| FR-10.4 | The header action buttons shall wrap below the title on mobile viewports. |

### FR-11 Save Scenarios

| ID | Requirement |
|----|-------------|
| FR-11.1 | Each InputForm panel shall include a "💾 Save" button and a "Load" button. |
| FR-11.2 | Clicking "Save" shall serialise the current inputs to JSON and write them to `localStorage` under the key `roi-saved-{label}` (e.g. `roi-saved-Scenario A`). |
| FR-11.3 | The "Load" button shall be disabled on initial render if no saved data exists in `localStorage` for that scenario. |
| FR-11.4 | Clicking "Save" shall enable the "Load" button for that scenario. |
| FR-11.5 | Clicking "Load" shall restore the saved inputs via the `onChange` handler; the form shall update immediately. |
| FR-11.6 | Saves shall be independent per scenario — saving Scenario A shall not affect Scenario B's save state. |
| FR-11.7 | Saved inputs shall persist across page reloads via `localStorage`. |
| FR-11.8 | Both buttons shall have descriptive `aria-label` attributes (e.g. `"Save Scenario A inputs"`, `"Load saved Scenario A inputs"`). |

### FR-12 Chart Animation

| ID | Requirement |
|----|-------------|
| FR-12.1 | Both `<Line>` components in the cash flow chart shall animate on first render using Recharts' built-in animation props. |
| FR-12.2 | Animation duration shall be 600 ms with `ease-out` easing and no initial delay (`animationBegin={0}`). |

### FR-13 Multi-Currency

| ID | Requirement |
|----|-------------|
| FR-13.1 | A currency `<select>` control shall be present in the page header, offering USD (`$`), EUR (`€`), and RUB (`₽`). |
| FR-13.2 | The selected currency shall be persisted to `localStorage` under the key `currency` and restored on page load. |
| FR-13.3 | All monetary display values — InputForm field labels, Results panel, Breakdown Table cells, and chart Y-axis/tooltip — shall update to reflect the selected currency without a page reload. |
| FR-13.4 | Currency formatting shall use `Intl.NumberFormat` with the locale and currency code matching the selection (e.g. `de-DE` / `EUR` for Euro). |
| FR-13.5 | The currency selector shall have an associated `<label>` element (may be visually hidden via `.sr-only`) for accessibility. |
| FR-13.6 | Currency formatting shall be implemented in `src/utils/currency.js` as pure, independently testable functions. |

---

## 6. Acceptance Criteria

### AC-01 Input Validation

| Criterion | Given | When | Then |
|-----------|-------|------|------|
| AC-01.1 | A numeric field is cleared or set to 0 | User changes the value | A red border and inline error "Must be greater than $0" appear immediately |
| AC-01.2 | An invalid scenario | Any input is invalid | The Results panel shows "Fix the errors above to see results" instead of metrics |
| AC-01.3 | Both scenarios are invalid | Both have errors | The chart shows "Fix the errors above to see the chart" and no lines are drawn |
| AC-01.4 | Scenario A is invalid, B is valid | Scenario A has an error | Scenario B results and its chart line remain fully visible; only Scenario A is suppressed |
| AC-01.5 | A previously invalid field is corrected | User enters a valid value | The error clears, results and the chart line are restored within the same render cycle |

### AC-02 Calculation Accuracy

| Criterion | Inputs | Expected Output |
|-----------|--------|-----------------|
| AC-02.1 | Investment $100,000 / Revenue $15,000 / Costs $5,000 / 12 mo | ROI: 20.0%, Payback: 10 months, Net Profit: $20,000, Monthly Net: $10,000 |
| AC-02.2 | Revenue = Costs (zero net profit) | Payback Period displays "Never" |
| AC-02.3 | Payback period exceeds selected period | Display reads "{N} mo (beyond period)" |
| AC-02.4 | Month 10 cumulative cash flow (above example) | `($10,000 × 10) − $100,000 = $0` — break-even |
| AC-02.5 | Negative net profit scenario | ROI is negative, displayed in red |

### AC-03 Cash Flow Chart

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-03.1 | Both scenarios valid | Two coloured lines render: blue (A) and orange (B) |
| AC-03.2 | Break-even reference | A dashed horizontal line at Y=0 labelled "Break-even" is present |
| AC-03.3 | Tooltip on hover | Shows "Month N" label and a currency-formatted value (e.g. $X,XXX or €X.XXX) for each scenario |
| AC-03.4 | Y-axis ticks | Formatted as "{symbol}Xk" using the selected currency symbol (e.g. $10k, €10k, ₽10k) |
| AC-03.5 | Scenarios with different periods | The chart X-axis extends to the longer period; shorter scenario data stops at its last month |

### AC-04 Breakdown Table

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-04.1 | Page load | Table is hidden; "Show Table" button is visible and enabled |
| AC-04.2 | "Show Table" clicked | Table appears with correct Month, Revenue, Costs, Net Profit columns |
| AC-04.3 | Break-even month | The first row where cumulative cash flow ≥ 0 has a green background |
| AC-04.4 | Scenario invalid | "Show Table" button is disabled; "Fix the errors above" message is shown |
| AC-04.5 | "Hide Table" clicked | Table collapses; button returns to "Show Table" |

### AC-05 PDF Export

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-05.1 | "Export PDF" clicked | Button disables and shows "⏳ Exporting…" |
| AC-05.2 | Export complete | A file named `roi-analysis-YYYY-MM-DD.pdf` downloads automatically |
| AC-05.3 | PDF content | First page contains heading "ROI Analysis Report" (blue), generated date, rule, and screenshot of the calculator |
| AC-05.4 | Export complete | Button resets to "⬇ Export PDF" and is re-enabled |

### AC-06 Dark Theme

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-06.1 | "🌙 Dark" clicked | All surfaces (background, cards, inputs, chart) switch to dark colour scheme |
| AC-06.2 | Dark mode active | Button label changes to "☀ Light" |
| AC-06.3 | Theme persisted | Reloading the page in the same browser restores dark mode |
| AC-06.4 | Dark colour contrast | All text/background pairs in dark mode meet ≥4.5:1 WCAG 2.1 AA ratio |
| AC-06.5 | "☀ Light" clicked | UI returns to light mode; localStorage updates to "light" |

### AC-07 Embed Modal

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-07.1 | "</> Embed" clicked | Modal opens with heading "Embed Calculator" |
| AC-07.2 | Textarea content | Contains a full `<iframe>` snippet with the current page origin |
| AC-07.3 | Textarea is read-only | User cannot type into the textarea |
| AC-07.4 | Textarea clicked | All text in the textarea is selected automatically |
| AC-07.5 | "Copy Code" clicked | Clipboard receives the iframe snippet; button shows "✓ Copied!" |
| AC-07.6 | 2 seconds after copy | Button resets to "Copy Code" |
| AC-07.7 | Overlay clicked | Modal closes |
| AC-07.8 | ✕ button clicked | Modal closes |
| AC-07.9 | Modal box clicked | Modal does NOT close (click is contained within modal) |

### AC-08 Accessibility

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-08.1 | Any page state | `axe-core` reports 0 WCAG 2.1 AA violations |
| AC-08.2 | All form inputs | Each has a visible `<label>` element associated via `htmlFor`/`id` |
| AC-08.3 | Action buttons | Each has a descriptive `aria-label` (e.g. `"Export PDF"`, `"Get embed code"`) |
| AC-08.4 | Embed modal | Has `role="dialog"`, `aria-modal="true"`, `aria-labelledby="embed-title"` |
| AC-08.5 | Error messages | Adjacent to the invalid field and readable in DOM order |

### AC-09 Save Scenarios

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-09.1 | Page load, no prior save | "Load" button is disabled; "Save" button is enabled |
| AC-09.2 | "Save" clicked | Inputs are written to `localStorage`; "Load" button becomes enabled |
| AC-09.3 | "Load" clicked after saving | Form fields are restored to the previously saved values |
| AC-09.4 | Scenario A saved, Scenario B not saved | Scenario B "Load" button remains disabled |
| AC-09.5 | Page reloaded after saving | "Load" button is enabled; clicking it restores the saved values |

### AC-10 Multi-Currency

| Criterion | Condition | Expected Behaviour |
|-----------|-----------|-------------------|
| AC-10.1 | Currency changed to EUR | InputForm labels show `(€)`, Results values contain `€`, table cells contain `€` |
| AC-10.2 | Currency changed to RUB | All monetary displays update to `₽` |
| AC-10.3 | Currency changed to USD | All monetary displays use `$` |
| AC-10.4 | Currency persisted | Reloading the page restores the last selected currency from `localStorage` |
| AC-10.5 | Currency selector | Has an associated label; present in the header; `aria-label="Select currency"` |

---

## 7. Non-Functional Requirements

### NFR-01 Performance

| ID | Requirement | Threshold | Measured By |
|----|-------------|-----------|-------------|
| NFR-01.1 | Lighthouse Performance score | ≥ 80 | Lighthouse CI (`lhci autorun`) |
| NFR-01.2 | Page interactive on first load (no auth, no backend) | < 3 s on simulated 4G | Lighthouse TTI |
| NFR-01.3 | Input-to-result re-render latency | Imperceptible (< 16 ms / 60 fps) | Manual observation |

### NFR-02 Accessibility

| ID | Requirement | Threshold | Measured By |
|----|-------------|-----------|-------------|
| NFR-02.1 | Lighthouse Accessibility score | ≥ 90 | Lighthouse CI |
| NFR-02.2 | WCAG 2.1 Level AA conformance | 0 violations | `axe-core` via Playwright (`npm run test:a11y`) |
| NFR-02.3 | Keyboard navigability | All interactive elements reachable via Tab; operable via Enter/Space | Manual + E2E |
| NFR-02.4 | Colour contrast — normal text (light mode) | ≥ 4.5:1 | Design token audit |
| NFR-02.5 | Colour contrast — normal text (dark mode) | ≥ 4.5:1 | Design token audit |

### NFR-03 Code Quality

| ID | Requirement | Threshold | Measured By |
|----|-------------|-----------|-------------|
| NFR-03.1 | Unit test pass rate | 100% (0 failures) | Vitest (`npm run test:coverage`) |
| NFR-03.2 | Unit test coverage — statements | ≥ 95% | Vitest / V8 coverage |
| NFR-03.3 | Unit test coverage — functions | ≥ 95% | Vitest / V8 coverage |
| NFR-03.4 | Unit test coverage — branches | ≥ 95% | Vitest / V8 coverage |
| NFR-03.5 | Unit test coverage — lines | ≥ 95% | Vitest / V8 coverage |
| NFR-03.6 | E2E behavioural test pass rate (58 tests) | 100% (0 failures) | Playwright (`npm run test:e2e`) |
| NFR-03.7 | E2E coverage — statements / functions / branches / lines | > 79% | nyc + Istanbul (`npm run check:e2e:coverage`) |
| NFR-03.8 | ESLint errors | 0 | ESLint (`npm run lint`) |

### NFR-04 Security

| ID | Requirement | Threshold | Measured By |
|----|-------------|-----------|-------------|
| NFR-04.1 | npm dependency vulnerabilities (moderate / high / critical) | 0 | `npm audit --audit-level=moderate` |
| NFR-04.2 | No hardcoded credentials or secrets in source | 0 occurrences | Code review + CI scan |
| NFR-04.3 | Clipboard API fallback | No silent failure — `execCommand` fallback used | Unit test AC-07.5 |

### NFR-05 Build & Packaging

| ID | Requirement | Threshold | Measured By |
|----|-------------|-----------|-------------|
| NFR-05.1 | Production build compiles without errors | 0 build errors | `npm run build` (Vite) |
| NFR-05.2 | npm pack produces a valid tarball | `.tgz` artifact created | `npm pack` (CI Gate 2) |
| NFR-05.3 | Lighthouse Best Practices score | ≥ 80 | Lighthouse CI |
| NFR-05.4 | Lighthouse SEO score | ≥ 70 (warning, non-blocking) | Lighthouse CI |

### NFR-06 Compatibility & Responsiveness

| ID | Requirement |
|----|-------------|
| NFR-06.1 | The application shall function correctly in the latest stable release of Chrome (primary test browser). |
| NFR-06.2 | The layout shall be fully usable on viewport widths ≥ 320px (mobile) without horizontal scroll. |
| NFR-06.3 | All CSS units shall use relative sizing (rem, %, vw) where appropriate; fixed-width containers shall not overflow on small screens. |
| NFR-06.4 | The application is a client-side SPA — no server-side rendering, no backend, no authentication. |

### NFR-07 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-07.1 | Each component shall be in its own file with a PascalCase filename matching the default export. |
| NFR-07.2 | Calculation logic shall be a pure function with no side effects, independently testable. |
| NFR-07.3 | All theme colours shall be defined exclusively as CSS custom properties in `:root` and `[data-theme="dark"]` — no inline hex values in components (Recharts chart colour props excepted). |
| NFR-07.4 | New components shall have at least one unit test in the same pull request. |
| NFR-07.5 | New UI interactions shall have at least one E2E test in `e2e/app.spec.js` in the same pull request. |

---

## 8. Constraints & Assumptions

### Technical Constraints

| Constraint | Detail |
|------------|--------|
| No CSS frameworks | Inline styles and plain CSS only — no Tailwind, MUI, Bootstrap, or similar |
| No additional chart libraries | Recharts (already installed) handles all visualisation needs |
| React functional components only | No class components; no legacy lifecycle methods |
| No external state management | React `useState` / `useEffect` only — no Redux, Zustand, or similar |
| Package manager | `npm` only — do not use `yarn`, `pnpm`, or `bun` |
| Node.js | ≥ 18 required (Playwright and Vite dependency) |

### Assumptions

| Assumption | Detail |
|------------|--------|
| Multi-currency | Three display currencies are supported: USD ($), EUR (€), RUB (₽). No conversion rates are applied — the same numeric values are reformatted using `Intl.NumberFormat`. Currency preference is persisted to `localStorage`. |
| Linear revenue model | Monthly Revenue and Monthly Costs are constant throughout the period — no growth curves, seasonality, or variable costs |
| Cumulative cash flow only | The chart shows cumulative (running total) cash flow, not monthly delta |
| Partial data persistence | Theme and currency preferences are always persisted to `localStorage`. Each scenario's inputs can optionally be saved via the "💾 Save" button and restored via "Load"; unsaved scenarios reset to defaults on page load. |
| No user accounts | There is no authentication, login, or user profile system |
| Client-side only | The embed snippet points to the hosted URL; there is no server-side component to proxy or protect |
| SonarQube optional | Gates 11 and 12 (SonarQube) are disabled until `SONAR_TOKEN` and `SONAR_HOST_URL` secrets are configured in GitHub |
