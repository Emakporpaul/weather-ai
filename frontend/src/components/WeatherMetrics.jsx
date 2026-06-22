import WeatherIcon from './WeatherIcon'
import { getConditionCategory } from '../utils/formatters'

/**
 * WeatherMetrics — the hero section.
 * Big temperature, breathing weather icon, and a quiet grid of stats beneath.
 */
export default function WeatherMetrics({ data }) {
  if (!data) return null
  const { location, current } = data
  const category = getConditionCategory(current.condition_code)

  const stats = [
    { label: 'Feels like', value: `${current.feels_like}°`, },
    { label: 'Humidity', value: `${current.humidity}%` },
    { label: 'Wind', value: `${current.wind_speed} km/h` },
    { label: 'Visibility', value: `${current.visibility.toFixed(1)} km` },
  ]

  return (
    <div className="text-center">
      <p className="font-body text-sm tracking-wide text-ink/50 mb-1">
        {location.name}{location.country ? `, ${location.country}` : ''}
      </p>

      <div className="flex items-center justify-center gap-4 my-2">
        <WeatherIcon category={category} size={88} />
        <div className="text-left">
          <div className="font-display text-7xl font-light text-ink leading-none">
            {current.temp}°
          </div>
        </div>
      </div>

      <p className="font-body text-base text-ink/70 capitalize mb-6">
        {current.condition}
      </p>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/50 py-3 px-2">
            <p className="font-display text-lg text-ink">{s.value}</p>
            <p className="font-body text-[11px] text-ink/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
