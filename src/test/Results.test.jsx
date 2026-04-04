import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Results from '../components/Results'
import { calculateROI } from '../utils/calculations'

const inputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }
const results = calculateROI(inputs)

describe('Results', () => {
  it('shows the scenario label', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText(/Scenario A — Results/i)).toBeInTheDocument()
  })

  it('displays formatted ROI percentage', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText('20.0%')).toBeInTheDocument()
  })

  it('displays payback period in months', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText('10 months')).toBeInTheDocument()
  })

  it('displays formatted total net profit', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText('$20,000')).toBeInTheDocument()
  })

  it('shows "Never" when payback period is null', () => {
    const noProfit = calculateROI({ ...inputs, monthlyCosts: 15000 })
    render(<Results label="Scenario A" results={noProfit} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText('Never')).toBeInTheDocument()
  })

  it('shows "beyond period" when payback exceeds selected period', () => {
    const slow = calculateROI({ ...inputs, monthlyRevenue: 6000, monthlyCosts: 5000, period: 12 })
    render(<Results label="Scenario A" results={slow} inputs={{ ...inputs, period: 12 }} colorClass="accent-a" />)
    expect(screen.getByText(/beyond period/i)).toBeInTheDocument()
  })

  it('renders disabled state with message instead of results', () => {
    render(<Results label="Scenario A" results={null} inputs={inputs} colorClass="accent-a" disabled />)
    expect(screen.getByText(/Fix the errors above/i)).toBeInTheDocument()
    expect(screen.queryByText('ROI')).not.toBeInTheDocument()
  })
})
