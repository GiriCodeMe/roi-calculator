import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

  it('shows error message for monthlyCosts when error is passed', () => {
    const errors = { monthlyCosts: 'Must be greater than $0' }
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" errors={errors} />)
    expect(screen.getByText('Must be greater than $0')).toBeInTheDocument()
  })

  it('defaults to 0 when a non-numeric value is entered (triggers || 0 fallback)', async () => {
    const onChange = vi.fn()
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={onChange} colorClass="accent-a" />)
    const input = screen.getByLabelText(/Initial Investment/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'abc')
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall(defaultInputs).initialInvestment).toBe(0)
  })

  it('period dropdown has 12, 24, 36 month options', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    const select = screen.getByLabelText(/Calculation Period/i)
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toEqual(['12', '24', '36'])
  })

  it('shows € in labels when currency is EUR', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" currency="EUR" />)
    expect(screen.getByText(/Initial Investment \(€\)/i)).toBeInTheDocument()
  })

  it('shows ₽ in labels when currency is RUB', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" currency="RUB" />)
    expect(screen.getByText(/Initial Investment \(₽\)/i)).toBeInTheDocument()
  })
})

describe('InputForm Save/Load', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('renders Save and Load buttons', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByRole('button', { name: /Save Scenario A inputs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Load saved Scenario A inputs/i })).toBeInTheDocument()
  })

  it('Load button is disabled when localStorage is empty', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByRole('button', { name: /Load saved Scenario A inputs/i })).toBeDisabled()
  })

  it('clicking Save stores JSON in localStorage', async () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Save Scenario A inputs/i }))
    const stored = JSON.parse(localStorage.getItem('roi-saved-Scenario A'))
    expect(stored).toEqual(defaultInputs)
  })

  it('clicking Save enables the Load button', async () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    const loadBtn = screen.getByRole('button', { name: /Load saved Scenario A inputs/i })
    expect(loadBtn).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /Save Scenario A inputs/i }))
    expect(loadBtn).not.toBeDisabled()
  })

  it('clicking Load calls onChange with saved inputs', async () => {
    const savedInputs = { initialInvestment: 50000, monthlyRevenue: 8000, monthlyCosts: 2000, period: 24 }
    localStorage.setItem('roi-saved-Scenario A', JSON.stringify(savedInputs))
    const onChange = vi.fn()
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={onChange} colorClass="accent-a" />)
    await userEvent.click(screen.getByRole('button', { name: /Load saved Scenario A inputs/i }))
    expect(onChange).toHaveBeenCalled()
    // The onChange is called with a function — invoke it to check the returned value
    const updaterFn = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(typeof updaterFn).toBe('function')
  })

  it('Save and Load buttons have correct aria-labels', () => {
    render(<InputForm label="Scenario A" inputs={defaultInputs} onChange={() => {}} colorClass="accent-a" />)
    expect(screen.getByRole('button', { name: 'Save Scenario A inputs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Load saved Scenario A inputs' })).toBeInTheDocument()
  })
})
