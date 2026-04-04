import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmbedModal from '../components/EmbedModal'

// jsdom doesn't implement clipboard — provide a writable mock
const writeTextMock = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: writeTextMock },
  writable: true,
  configurable: true,
})

describe('EmbedModal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
    writeTextMock.mockClear()
  })

  it('renders the modal title', () => {
    render(<EmbedModal onClose={onClose} />)
    expect(screen.getByRole('heading', { name: /embed calculator/i })).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<EmbedModal onClose={onClose} />)
    expect(screen.getByText(/copy the snippet/i)).toBeInTheDocument()
  })

  it('renders an iframe snippet in the textarea', () => {
    render(<EmbedModal onClose={onClose} />)
    const textarea = screen.getByLabelText(/embed code snippet/i)
    expect(textarea.value).toContain('<iframe')
    expect(textarea.value).toContain('ROI Calculator')
    expect(textarea.value).toContain('</iframe>')
  })

  it('textarea is read-only', () => {
    render(<EmbedModal onClose={onClose} />)
    expect(screen.getByLabelText(/embed code snippet/i)).toHaveAttribute('readonly')
  })

  it('calls clipboard.writeText when Copy Code is clicked', async () => {
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /copy code/i }))
    expect(writeTextMock).toHaveBeenCalledTimes(1)
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('<iframe'))
  })

  it('shows "Copied!" feedback after clicking copy', async () => {
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /copy code/i }))
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked', async () => {
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onClose when the modal box itself is clicked', async () => {
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('heading', { name: /embed calculator/i }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('falls back to execCommand when clipboard.writeText rejects', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('denied'))
    // jsdom doesn't define execCommand — add it before the test
    const execCommandMock = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      writable: true,
      configurable: true,
    })
    render(<EmbedModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /copy code/i }))
    await act(async () => {})
    expect(execCommandMock).toHaveBeenCalledWith('copy')
  })

  it('clicking the textarea selects all text', async () => {
    render(<EmbedModal onClose={onClose} />)
    const textarea = screen.getByLabelText(/embed code snippet/i)
    const selectMock = vi.fn()
    Object.defineProperty(textarea, 'select', { value: selectMock, writable: true })
    await userEvent.click(textarea)
    expect(selectMock).toHaveBeenCalled()
  })

  it('resets Copied! back to Copy Code after 2 seconds', () => {
    vi.useFakeTimers()
    render(<EmbedModal onClose={onClose} />)
    // fireEvent is synchronous — does not rely on setTimeout internally
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }))
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
