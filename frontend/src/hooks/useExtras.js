/**
 * useExtras — fetches air quality, UV, and daily forecast in parallel.
 * Kept as one hook since all three only matter once we have coordinates,
 * and the dashboard renders them together.
 */
import { useQuery } from '@tanstack/react-query'
import { getAirQuality, getUvIndex, getDailyForecast } from '../services/extras'

export function useAirQuality(lat, lon) {
  return useQuery({
    queryKey: ['air-quality', lat, lon],
    queryFn: () => getAirQuality(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 15 * 60 * 1000,
  })
}

export function useUvIndex(lat, lon) {
  return useQuery({
    queryKey: ['uv-index', lat, lon],
    queryFn: () => getUvIndex(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 15 * 60 * 1000,
  })
}

export function useDailyForecast(lat, lon) {
  return useQuery({
    queryKey: ['daily-forecast', lat, lon],
    queryFn: () => getDailyForecast(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 15 * 60 * 1000,
  })
}
