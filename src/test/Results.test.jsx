import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Results from '../components/Results'
import { calculateROI } from '../utils/calculations'

const inputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }
const results = calculateROI(inputs)

describe('Results', () => {
  it('shows the scenario label', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText(/Scenario A — Results/i)).toBeInTheDocument()
  })

  it('displays formatted ROI percentage', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText('20.0%')).toBeInTheDocument()
  })

  it('displays payback period in months', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText('10 months')).toBeInTheDocument()
  })

  it('displays formatted total net profit in USD', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText(/20,000/)).toBeInTheDocument()
  })

  it('displays EUR symbol when currency is EUR', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="EUR" />)
    const values = screen.getAllByText(/€/)
    expect(values.length).toBeGreaterThan(0)
  })

  it('displays ₽ symbol when currency is RUB', () => {
    render(<Results label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" currency="RUB" />)
    const values = screen.getAllByText(/₽/)
    expect(values.length).toBeGreaterThan(0)
  })

  it('shows "Never" when payback period is null', () => {
    const noProfit = calculateROI({ ...inputs, monthlyCosts: 15000 })
    render(<Results label="Scenario A" results={noProfit} inputs={inputs} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText('Never')).toBeInTheDocument()
  })

  it('shows "beyond period" when payback exceeds selected period', () => {
    const slow = calculateROI({ ...inputs, monthlyRevenue: 6000, monthlyCosts: 5000, period: 12 })
    render(<Results label="Scenario A" results={slow} inputs={{ ...inputs, period: 12 }} colorClass="accent-a" currency="USD" />)
    expect(screen.getByText(/beyond period/i)).toBeInTheDocument()
  })

  it('shows negative class on total net profit when loss', () => {
    const loss = calculateROI({ ...inputs, period: 6 })
    const { container } = render(<Results label="Scenario A" results={loss} inputs={{ ...inputs, period: 6 }} colorClass="accent-a" currency="USD" />)
    const values = container.querySelectorAll('.result-value.negative')
    expect(values.length).toBeGreaterThan(0)
  })

  it('shows negative class on monthly net profit when costs exceed revenue', () => {
    const negMonthly = calculateROI({ ...inputs, monthlyCosts: 20000 })
    const { container } = render(<Results label="Scenario A" results={negMonthly} inputs={inputs} colorClass="accent-a" currency="USD" />)
    const negValues = container.querySelectorAll('.result-value.negative')
    expect(negValues.length).toBeGreaterThan(0)
  })

  it('renders disabled state with message instead of results', () => {
    render(<Results label="Scenario A" results={null} inputs={inputs} colorClass="accent-a" disabled currency="USD" />)
    expect(screen.getByText(/Fix the errors above/i)).toBeInTheDocument()
    expect(screen.queryByText('ROI')).not.toBeInTheDocument()
  })
})
