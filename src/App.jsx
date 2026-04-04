import { useState } from 'react'
import InputForm from './components/InputForm'
import Results from './components/Results'
import CashFlowChart from './components/CashFlowChart'
import BreakdownTable from './components/BreakdownTable'
import { calculateROI } from './utils/calculations'
import { validateInputs, hasErrors } from './utils/validation'
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

  const errorsA = validateInputs(inputsA)
  const errorsB = validateInputs(inputsB)
  const validA = !hasErrors(errorsA)
  const validB = !hasErrors(errorsB)

  const resultsA = validA ? calculateROI(inputsA) : null
  const resultsB = validB ? calculateROI(inputsB) : null

  return (
    <div className="app">
      <header className="app-header">
        <h1>ROI Calculator</h1>
        <p>Compare two investment scenarios side by side</p>
      </header>
      <main className="app-main">
        <div className="inputs-row">
          <InputForm label="Scenario A" inputs={inputsA} onChange={setInputsA} colorClass="accent-a" errors={errorsA} />
          <InputForm label="Scenario B" inputs={inputsB} onChange={setInputsB} colorClass="accent-b" errors={errorsB} />
        </div>
        <div className="results-row">
          <Results label="Scenario A" results={resultsA} inputs={inputsA} colorClass="accent-a" disabled={!validA} />
          <Results label="Scenario B" results={resultsB} inputs={inputsB} colorClass="accent-b" disabled={!validB} />
        </div>
        <CashFlowChart
          dataA={resultsA?.cashFlowData ?? []}
          dataB={resultsB?.cashFlowData ?? []}
          validA={validA}
          validB={validB}
        />
        <div className="tables-row">
          <BreakdownTable label="Scenario A" results={resultsA} inputs={inputsA} colorClass="accent-a" disabled={!validA} />
          <BreakdownTable label="Scenario B" results={resultsB} inputs={inputsB} colorClass="accent-b" disabled={!validB} />
        </div>
      </main>
    </div>
  )
}

export default App
