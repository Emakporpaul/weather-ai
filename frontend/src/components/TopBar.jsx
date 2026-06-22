import { useState } from 'react'

/**
 * TopBar — search input + GPS button + unit toggle.
 * Sits above the dashboard, MSN-style.
 */
export default function TopBar({ onLocationFound, unit, onUnitChange }) {
  const [query, setQuery] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/geocode?city=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      onLocationFound(data.lat, data.lon, `${data.name}${data.country ? ', ' + data.country : ''}`)
    } catch {
      setError('Location not found')
    }
  }

  function handleGPS() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
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
        setError('Could not detect location')
        setDetecting(false)
      }
    )
  }

  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-dash-bg border-b border-dash-border">
      <span className="font-display text-base font-medium text-dash-text whitespace-nowrap mr-2">
        Paulo Weather
      </span>

      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-sm gap-2">
        <div className="flex-1 flex items-center gap-2 bg-dash-panel rounded-full px-4 py-2 border border-dash-border focus-within:border-dash-accent/50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-dash-muted shrink-0">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for location"
            className="bg-transparent flex-1 text-sm font-body text-dash-text placeholder:text-dash-muted focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleGPS}
          disabled={detecting}
          aria-label="Use my current location"
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-dash-panel border border-dash-border hover:border-dash-accent/50 text-dash-muted transition-colors disabled:opacity-50"
        >
          {detecting ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
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
      </form>

      {error && <span className="text-xs text-red-400 font-body">{error}</span>}

      <div className="ml-auto flex items-center gap-1 bg-dash-panel rounded-full p-1 border border-dash-border">
        <button
          onClick={() => onUnitChange('metric')}
          className={`px-3 py-1 rounded-full text-xs font-body transition-colors ${unit === 'metric' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
        >
          °C
        </button>
        <button
          onClick={() => onUnitChange('imperial')}
          className={`px-3 py-1 rounded-full text-xs font-body transition-colors ${unit === 'imperial' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
        >
          °F
        </button>
      </div>
    </div>
  )
}
