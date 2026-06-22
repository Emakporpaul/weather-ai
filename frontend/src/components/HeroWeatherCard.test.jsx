/**
 * Tests for HeroWeatherCard — the most visually important component,
 * since it's the first thing every user sees after searching a location.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroWeatherCard from './HeroWeatherCard'

const mockData = {
  location: { name: 'Lagos', country: 'NG', lat: 6.45, lon: 3.38 },
  current: {
    temp: 29, feels_like: 32, humidity: 78, wind_speed: 10,
    visibility: 10.0, pressure: 1013, condition: 'scattered clouds',
    condition_code: 802, dt: 1718870400,
  },
}

describe('HeroWeatherCard', () => {
  it('renders nothing when no data is provided', () => {
    const { container } = render(<HeroWeatherCard data={null} unit="metric" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('displays the location name and country', () => {
    render(<HeroWeatherCard data={mockData} unit="metric" />)
    expect(screen.getByText('Lagos, NG')).toBeInTheDocument()
  })

  it('displays the current temperature', () => {
    render(<HeroWeatherCard data={mockData} unit="metric" />)
    expect(screen.getByText('29')).toBeInTheDocument()
  })

  it('displays the condition description', () => {
    render(<HeroWeatherCard data={mockData} unit="metric" />)
    expect(screen.getByText('scattered clouds')).toBeInTheDocument()
  })

  it('switches units correctly between metric and imperial', () => {
    const { rerender } = render(<HeroWeatherCard data={mockData} unit="metric" />)
    expect(screen.getByText('°C')).toBeInTheDocument()
    expect(screen.getByText('10 km/h')).toBeInTheDocument()

    rerender(<HeroWeatherCard data={mockData} unit="imperial" />)
    expect(screen.getByText('°F')).toBeInTheDocument()
    expect(screen.getByText('10 mph')).toBeInTheDocument()
  })

  it('shows all four key stats', () => {
    render(<HeroWeatherCard data={mockData} unit="metric" />)
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Humidity')).toBeInTheDocument()
    expect(screen.getByText('Feels like')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
  })
})
