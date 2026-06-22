/**
 * useWeather — custom React hook
 * Wraps React Query for auto-caching + background refresh.
 */
import { useQuery } from '@tanstack/react-query'
import { getWeather } from '../services/weather'

export function useWeather(lat, lon) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather(lat, lon),
    enabled: !!lat && !!lon,
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  })
}
