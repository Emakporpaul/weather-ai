/**
 * Extra data services — air quality, UV index, daily forecast.
 * Each hits a dedicated backend route, all backed by free data sources.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getAirQuality(lat, lon) {
  const res = await fetch(`${API_URL}/api/air-quality?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch air quality')
  return res.json()
}

export async function getUvIndex(lat, lon) {
  const res = await fetch(`${API_URL}/api/uv-index?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch UV index')
  return res.json()
}

export async function getDailyForecast(lat, lon) {
  const res = await fetch(`${API_URL}/api/daily-forecast?lat=${lat}&lon=${lon}`)
  if (!res.ok) throw new Error('Failed to fetch daily forecast')
  return res.json()
}
