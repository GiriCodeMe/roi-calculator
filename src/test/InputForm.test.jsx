import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputForm from '../components/InputForm'

const defaultInputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }

describe('InputForm', () => {
  it('renders the scenario label as heading', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByRole('heading', { name: 'Scenario A' })).toBeInTheDocument()
  })

  it('renders all four input fields', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByLabelText(/Initial Investment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Revenue/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Operating Costs/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Calculation Period/i)).toBeInTheDocument()
  })

  it('displays current input values', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByLabelText(/Initial Investment/i)).toHaveValue(100000)
    expect(screen.getByLabelText(/Monthly Revenue/i)).toHaveValue(15000)
  })

  it('calls onChange when a field value changes', async () => {
    const onChange = vi.fn()
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={onChange} colorClass="accent-a" />)
    const input = screen.getByLabelText(/Initial Investment/i)
    await userEvent.clear(input)
    await userEvent.type(input, '200000')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows no error messages when errors prop is empty', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" errors={{}} />)
    expect(screen.queryByText(/Must be greater/i)).not.toBeInTheDocument()
  })

  it('shows error message for initialInvestment when error is passed', () => {
    const errors = { initialInvestment: 'Must be greater than $0' }
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" errors={errors} />)
    expect(screen.getByText('Must be greater than $0')).toBeInTheDocument()
  })

  it('shows error messages for multiple invalid fields', () => {
    const errors = {
      initialInvestment: 'Must be greater than $0',
      monthlyRevenue: 'Must be greater than $0',
    }
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" errors={errors} />)
    expect(screen.getAllByText('Must be greater than $0')).toHaveLength(2)
  })

  it('period dropdown has 12, 24, 36 month options', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    const select = screen.getByLabelText(/Calculation Period/i)
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toEqual(['12', '24', '36'])
  })
})
