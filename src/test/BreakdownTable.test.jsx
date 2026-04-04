import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BreakdownTable from '../components/BreakdownTable'
import { calculateROI } from '../utils/calculations'

const inputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }
const results = calculateROI(inputs)

describe('BreakdownTable', () => {
  it('renders the scenario label', () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByText(/Scenario A — Monthly Breakdown/i)).toBeInTheDocument()
  })

  it('shows "Show Table" button by default', () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.getByRole('button', { name: /Show Table/i })).toBeInTheDocument()
  })

  it('table is hidden before toggle', () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows table after clicking "Show Table"', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('button label switches to "Hide Table" when open', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    expect(screen.getByRole('button', { name: /Hide Table/i })).toBeInTheDocument()
  })

  it('hides table again after clicking "Hide Table"', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    await userEvent.click(screen.getByRole('button', { name: /Hide Table/i }))
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renders correct number of rows for the period', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    const rows = screen.getAllByRole('row')
    // 1 header row + 12 data rows
    expect(rows).toHaveLength(13)
  })

  it('renders column headers: Month, Revenue, Costs, Net Profit', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
    expect(screen.getByText('Monthly Costs')).toBeInTheDocument()
    expect(screen.getByText('Net Profit')).toBeInTheDocument()
  })

  it('renders disabled state when disabled prop is set', () => {
    render(<BreakdownTable label="Scenario A" results={null} inputs={inputs} colorClass="accent-a" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText(/Fix the errors above/i)).toBeInTheDocument()
  })

  it('highlights the break-even row', async () => {
    render(<BreakdownTable label="Scenario A" results={results} inputs={inputs} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Show Table/i }))
    const rows = screen.getAllByRole('row')
    // payback is month 10 → row index 10 (index 0 = header)
    expect(rows[10]).toHaveClass('break-even-row')
  })
})
