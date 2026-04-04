import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ReferenceLine: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Legend: () => null,
}))

describe('App', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ROI Calculator/i })).toBeInTheDocument()
  })

  it('renders both scenario input forms', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Scenario A' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Scenario B' })).toBeInTheDocument()
  })

  it('renders results panels for both scenarios', () => {
    render(<App />)
    expect(screen.getByText('Scenario A — Results')).toBeInTheDocument()
    expect(screen.getByText('Scenario B — Results')).toBeInTheDocument()
  })

  it('renders breakdown table toggles for both scenarios', () => {
    render(<App />)
    expect(screen.getByText('Scenario A — Monthly Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Scenario B — Monthly Breakdown')).toBeInTheDocument()
  })

  it('disables Scenario A results when investment is set to 0', async () => {
    render(<App />)
    const investmentInput = screen.getAllByLabelText(/Initial Investment/i)[0]
    await userEvent.clear(investmentInput)
    await userEvent.type(investmentInput, '0')
    expect(screen.getByText(/Fix the errors above to see results/i)).toBeInTheDocument()
  })

  it('renders currency select with aria-label', () => {
    render(<App />)
    expect(screen.getByRole('combobox', { name: /select currency/i })).toBeInTheDocument()
  })

  it('currency select has USD, EUR, RUB options', () => {
    render(<App />)
    const select = screen.getByRole('combobox', { name: /select currency/i })
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toContain('USD')
    expect(options).toContain('EUR')
    expect(options).toContain('RUB')
  })
})
