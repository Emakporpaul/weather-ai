import WeatherIcon from './WeatherIcon'
import { getConditionCategory } from '../utils/formatters'

/**
 * HeroWeatherCard — dashboard version of the current conditions panel.
 * Mirrors MSN's "Current weather" card: big temp + icon, condition label,
 * and a stats grid below (air quality plugged in separately as its own card).
 */
export default function HeroWeatherCard({ data, unit }) {
  if (!data) return null
  const { location, current } = data
  const category = getConditionCategory(current.condition_code)
  const unitLabel = unit === 'metric' ? '°C' : '°F'
  const speedLabel = unit === 'metric' ? 'km/h' : 'mph'

  const stats = [
    { label: 'Wind', value: `${current.wind_speed} ${speedLabel}` },
    { label: 'Humidity', value: `${current.humidity}%` },
    { label: 'Feels like', value: `${current.feels_like}°` },
    { label: 'Visibility', value: `${current.visibility.toFixed(1)} km` },
    { label: 'Pressure', value: `${current.pressure} mb` },
  ]

  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="font-body text-sm text-dash-muted">Current weather</p>
        <p className="font-body text-xs text-dash-muted">
          {new Date(current.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <p className="font-display text-lg text-dash-text mb-4">
        {location.name}{location.country ? `, ${location.country}` : ''}
      </p>

      <div className="flex items-center gap-4 mb-5">
        <WeatherIcon category={category} size={64} />
        <div>
          <div className="font-display text-5xl font-light text-dash-text leading-none">
            {current.temp}<span className="text-3xl align-top">{unitLabel}</span>
          </div>
          <p className="font-body text-sm text-dash-muted capitalize mt-1">{current.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-dash-border">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-body text-[11px] text-dash-muted mb-0.5">{s.label}</p>
            <p className="font-display text-sm text-dash-text">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
