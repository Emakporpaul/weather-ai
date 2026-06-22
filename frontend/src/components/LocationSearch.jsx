import { useState } from 'react'

/**
 * LocationSearch — handles both manual city entry and GPS auto-detect.
 * Calls onLocationFound(lat, lon, name) once a location is resolved.
 */
export default function LocationSearch({ onLocationFound }) {
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
      setError('Location not found — try a different spelling')
    }
  }

  function handleGPS() {
    if (!navigator.geolocation) {
      setError('Your browser doesn\'t support location detection')
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
          setQuery(`${data.name}${data.country ? ', ' + data.country : ''}`)
          onLocationFound(latitude, longitude, `${data.name}${data.country ? ', ' + data.country : ''}`)
        } catch {
          onLocationFound(latitude, longitude, 'Your location')
        }
        setDetecting(false)
      },
      () => {
        setError('Could not detect your location — try typing it instead')
        setDetecting(false)
      }
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any city, state, or country"
          className="flex-1 px-4 py-3 rounded-2xl border border-ink/10 bg-white/70
                     placeholder:text-ink/40 text-ink font-body text-[15px]
                     focus:outline-none focus:ring-2 focus:ring-ink/20 transition-shadow"
        />
        <button
          type="button"
          onClick={handleGPS}
          disabled={detecting}
          aria-label="Use my current location"
          className="px-4 py-3 rounded-2xl bg-white/70 border border-ink/10
                     hover:bg-white transition-colors text-ink/70 disabled:opacity-50"
        >
          {detecting ? '...' : '📍'}
        </button>
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-ink text-white font-body text-[15px]
                     font-medium hover:bg-ink/90 transition-colors"
        >
          Search
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600 font-body">{error}</p>}
    </div>
  )
}
