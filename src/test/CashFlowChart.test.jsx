import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CashFlowChart, { formatY, formatTooltip, formatLabel } from '../components/CashFlowChart'
import { calculateROI } from '../utils/calculations'

vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ReferenceLine: () => null,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => null,
}))

const inputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }
const dataA = calculateROI(inputs).cashFlowData
const dataB = calculateROI({ ...inputs, initialInvestment: 150000 }).cashFlowData

describe('formatY', () => {
  it('formats thousands as $Xk', () => {
    expect(formatY(10000)).toBe('$10k')
    expect(formatY(-5000)).toBe('$-5k')
    expect(formatY(0)).toBe('$0k')
  })
})

describe('formatTooltip', () => {
  it('returns formatted currency and name', () => {
    expect(formatTooltip(12345, 'Scenario A')).toEqual(['$12,345', 'Scenario A'])
    expect(formatTooltip(-5000, 'Scenario B')).toEqual(['$-5,000', 'Scenario B'])
  })
})

describe('formatLabel', () => {
  it('returns "Month N" string', () => {
    expect(formatLabel(1)).toBe('Month 1')
    expect(formatLabel(12)).toBe('Month 12')
  })
})

describe('CashFlowChart', () => {
  it('renders the chart heading', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByText('Cumulative Cash Flow')).toBeInTheDocument()
  })

  it('renders the chart when both scenarios are valid', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders Scenario A line when only A is valid', () => {
    render(<CashFlowChart dataA={dataA} dataB={[]} validA validB={false} />)
    expect(screen.getByTestId('line-Scenario A')).toBeInTheDocument()
    expect(screen.queryByTestId('line-Scenario B')).not.toBeInTheDocument()
  })

  it('renders Scenario B line when only B is valid', () => {
    render(<CashFlowChart dataA={[]} dataB={dataB} validA={false} validB />)
    expect(screen.getByTestId('line-Scenario B')).toBeInTheDocument()
    expect(screen.queryByTestId('line-Scenario A')).not.toBeInTheDocument()
  })

  it('shows disabled message when both scenarios are invalid', () => {
    render(<CashFlowChart dataA={[]} dataB={[]} validA={false} validB={false} />)
    expect(screen.getByText(/Fix the errors above/i)).toBeInTheDocument()
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument()
  })

  it('renders chart in dark mode without errors', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB darkMode />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('handles mismatched periods — pads shorter scenario with null (triggers ?? null)', () => {
    const shortData = calculateROI({ ...inputs, period: 6 }).cashFlowData   // 6 months
    const longData  = calculateROI({ ...inputs, period: 12 }).cashFlowData  // 12 months
    render(<CashFlowChart dataA={shortData} dataB={longData} validA validB />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })
})
