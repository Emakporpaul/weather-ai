import { useState } from 'react'
import { humanizeError } from '../utils/formatters'

/**
 * TopBar — search, GPS, unit toggle.
 * Fixed: explicit Search button visible at all times, humanized errors,
 * displays matched location name to prevent wrong-country confusion.
 */
export default function TopBar({ onLocationFound, unit, onUnitChange, onMenuOpen }) {
  const [query, setQuery] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/geocode?city=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      // Update input to show exactly what was matched — prevents Ghana/India confusion
      setQuery(data.display_name || `${data.name}${data.country ? ', ' + data.country : ''}`)
      onLocationFound(data.lat, data.lon, data.display_name || data.name)
    } catch (err) {
      setError(humanizeError(err, 'location'))
    } finally {
      setLoading(false)
    }
  }

  function handleGPS() {
    if (!navigator.geolocation) {
      setError('Your browser doesn\'t support location detection.')
      return
    }
    setDetecting(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(`${API_URL}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          const name = `${data.name}${data.country ? ', ' + data.country : ''}`
          setQuery(name)
          onLocationFound(latitude, longitude, name)
        } catch {
          onLocationFound(latitude, longitude, 'Your location')
        }
        setDetecting(false)
      },
      () => {
        setError('Could not detect your location — please type it instead.')
        setDetecting(false)
      }
    )
  }

  return (
    <div className="flex flex-col border-b border-dash-border bg-dash-bg">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Hamburger — mobile only, opens sidebar drawer */}
        <button
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-white/5 text-dash-muted"
        >
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>

        <span className="font-display text-sm font-medium text-dash-text whitespace-nowrap hidden sm:block">
          Paulo Weather
        </span>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex items-center flex-1 gap-2 max-w-lg">
          <div className="flex-1 flex items-center gap-2 bg-dash-panel rounded-xl px-3 py-2 border border-dash-border focus-within:border-dash-accent/50 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-dash-muted shrink-0">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any city or country worldwide..."
              className="bg-transparent flex-1 text-sm font-body text-dash-text placeholder:text-dash-muted focus:outline-none min-w-0"
            />
          </div>

          {/* GPS button */}
          <button
            type="button"
            onClick={handleGPS}
            disabled={detecting}
            aria-label="Use my current location"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-dash-panel border border-dash-border hover:border-dash-accent/50 text-dash-muted transition-colors disabled:opacity-50"
          >
            {detecting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>

          {/* Explicit search button — always visible */}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-dash-accent text-dash-bg font-body text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Unit toggle */}
        <div className="ml-auto flex items-center gap-1 bg-dash-panel rounded-full p-1 border border-dash-border shrink-0">
          <button
            onClick={() => onUnitChange('metric')}
            className={`px-2.5 py-1 rounded-full text-xs font-body transition-colors ${unit === 'metric' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
          >
            °C
          </button>
          <button
            onClick={() => onUnitChange('imperial')}
            className={`px-2.5 py-1 rounded-full text-xs font-body transition-colors ${unit === 'imperial' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
          >
            °F
          </button>
        </div>
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs font-body text-red-400">{error}</p>
      )}
    </div>
  )
}
