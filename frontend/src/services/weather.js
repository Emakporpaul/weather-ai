/**
 * Weather Service
 * Calls our FastAPI backend which proxies to OpenWeatherMap.
 * Returns a normalized weather object — frontend never talks to OWM directly.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getWeather(lat, lon) {
  const res = await fetch(`${API_URL}/api/weather?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch weather data')
  return res.json()
  // Returns: { location, current, forecast[] }
}

export async function geocodeCity(city) {
  const res = await fetch(`${API_URL}/api/geocode?city=${encodeURIComponent(city)}`)
  if (!res.ok) throw new Error('City not found')
  return res.json()
  // Returns: { lat, lon, name, country, state }
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(`${API_URL}/api/reverse-geocode?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Could not identify location')
  return res.json()
  // Returns: { name, country, state }
}
