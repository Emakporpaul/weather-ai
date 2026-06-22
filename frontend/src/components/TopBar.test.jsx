/**
 * Tests for TopBar — covers the most critical user flow in the app:
 * searching for a city. We mock window.fetch since this component calls
 * our backend's /api/geocode endpoint.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopBar from './TopBar'

describe('TopBar', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('renders the search input and unit toggle', () => {
    render(<TopBar onLocationFound={vi.fn()} unit="metric" onUnitChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search for location')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
    expect(screen.getByText('°F')).toBeInTheDocument()
  })

  it('calls onLocationFound with correct coordinates after a successful search', async () => {
    const user = userEvent.setup()
    const onLocationFound = vi.fn()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ lat: 6.45, lon: 3.38, name: 'Lagos', country: 'NG' }),
    })

    render(<TopBar onLocationFound={onLocationFound} unit="metric" onUnitChange={vi.fn()} />)

    const input = screen.getByPlaceholderText('Search for location')
    await user.type(input, 'Lagos')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(onLocationFound).toHaveBeenCalledWith(6.45, 3.38, 'Lagos, NG')
    })
  })

  it('shows an error message when a city is not found', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({ ok: false })

    render(<TopBar onLocationFound={vi.fn()} unit="metric" onUnitChange={vi.fn()} />)

    const input = screen.getByPlaceholderText('Search for location')
    await user.type(input, 'NotARealPlaceXYZ')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Location not found')).toBeInTheDocument()
    })
  })

  it('calls onUnitChange when toggling between °C and °F', async () => {
    const user = userEvent.setup()
    const onUnitChange = vi.fn()

    render(<TopBar onLocationFound={vi.fn()} unit="metric" onUnitChange={onUnitChange} />)
    await user.click(screen.getByText('°F'))

    expect(onUnitChange).toHaveBeenCalledWith('imperial')
  })

  it('does not search when the input is empty', async () => {
    const user = userEvent.setup()
    render(<TopBar onLocationFound={vi.fn()} unit="metric" onUnitChange={vi.fn()} />)

    const input = screen.getByPlaceholderText('Search for location')
    await user.click(input)
    await user.keyboard('{Enter}')

    expect(fetch).not.toHaveBeenCalled()
  })
})
