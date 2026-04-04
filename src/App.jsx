import { useState, useEffect, useRef } from 'react'
import InputForm from './components/InputForm'
import Results from './components/Results'
import CashFlowChart from './components/CashFlowChart'
import BreakdownTable from './components/BreakdownTable'
import EmbedModal from './components/EmbedModal'
import { calculateROI } from './utils/calculations'
import { validateInputs, hasErrors } from './utils/validation'
import { exportToPDF } from './utils/exportPdf'
import { CURRENCIES } from './utils/currency'
import './App.css'

const DEFAULT_INPUTS_A = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
}

const DEFAULT_INPUTS_B = {
  initialInvestment: 150000,
  monthlyRevenue: 20000,
  monthlyCosts: 7000,
  period: 12,
}

function App() {
  const [inputsA, setInputsA] = useState(DEFAULT_INPUTS_A)
  const [inputsB, setInputsB] = useState(DEFAULT_INPUTS_B)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('currency') ?? 'USD'
  )
  const [embedOpen, setEmbedOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const exportRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : ''
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const errorsA = validateInputs(inputsA)
  const errorsB = validateInputs(inputsB)
  const validA = !hasErrors(errorsA)
  const validB = !hasErrors(errorsB)

  const resultsA = validA ? calculateROI(inputsA) : null
  const resultsB = validB ? calculateROI(inputsB) : null

  async function handleExport() {
    if (!exportRef.current) return
    setExporting(true)
    try {
      await exportToPDF(exportRef.current)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1>ROI Calculator</h1>
          <p>Compare two investment scenarios side by side</p>
        </div>
        <div className="header-actions">
          <label htmlFor="currency-select" className="sr-only">Select currency</label>
          <select
            id="currency-select"
            className="action-btn"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            aria-label="Select currency"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          <button
            className="action-btn"
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>
          <button
            className="action-btn"
            onClick={handleExport}
            disabled={exporting}
            aria-label="Export PDF"
          >
            {exporting ? '⏳ Exporting…' : '⬇ Export PDF'}
          </button>
          <button
            className="action-btn"
            onClick={() => setEmbedOpen(true)}
            aria-label="Get embed code"
          >
            {'</> Embed'}
          </button>
        </div>
      </header>

      <main className="app-main" ref={exportRef}>
        <div className="inputs-row">
          <InputForm label="Scenario A" inputs={inputsA} onChange={setInputsA} colorClass="accent-a" errors={errorsA} currency={currency} />
          <InputForm label="Scenario B" inputs={inputsB} onChange={setInputsB} colorClass="accent-b" errors={errorsB} currency={currency} />
        </div>
        <div className="results-row">
          <Results label="Scenario A" results={resultsA} inputs={inputsA} colorClass="accent-a" disabled={!validA} currency={currency} />
          <Results label="Scenario B" results={resultsB} inputs={inputsB} colorClass="accent-b" disabled={!validB} currency={currency} />
        </div>
        <CashFlowChart
          dataA={resultsA?.cashFlowData ?? []}
          dataB={resultsB?.cashFlowData ?? []}
          validA={validA}
          validB={validB}
          darkMode={darkMode}
          currency={currency}
        />
        <div className="tables-row">
          <BreakdownTable label="Scenario A" results={resultsA} inputs={inputsA} colorClass="accent-a" disabled={!validA} currency={currency} />
          <BreakdownTable label="Scenario B" results={resultsB} inputs={inputsB} colorClass="accent-b" disabled={!validB} currency={currency} />
        </div>
      </main>

      {embedOpen && <EmbedModal onClose={() => setEmbedOpen(false)} />}
    </div>
  )
}

export default App
