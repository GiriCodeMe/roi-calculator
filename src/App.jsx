import { useState } from 'react'
import InputForm from './components/InputForm'
import Results from './components/Results'
import CashFlowChart from './components/CashFlowChart'
import { calculateROI } from './utils/calculations'
import './App.css'

const DEFAULT_INPUTS = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
}

function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const results = calculateROI(inputs)

  return (
    <div className="app">
      <header className="app-header">
        <h1>ROI Calculator</h1>
        <p>Estimate your return on investment over time</p>
      </header>
      <main className="app-main">
        <div className="left-panel">
          <InputForm inputs={inputs} onChange={setInputs} />
        </div>
        <div className="right-panel">
          <Results results={results} inputs={inputs} />
          <CashFlowChart data={results.cashFlowData} />
        </div>
      </main>
    </div>
  )
}

export default App
