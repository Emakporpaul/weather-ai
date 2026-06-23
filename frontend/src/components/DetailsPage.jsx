/**
 * DetailsPage — full weather details grid, MSN-style.
 * Every value here comes from data we already fetch — no new API calls needed.
 */
import { convertTemp, convertWindSpeed } from '../utils/formatters'

function DetailCard({ title, value, unit, subtitle, badge }) {
  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-xs text-dash-muted">{title}</p>
        {badge && <span className="text-[10px] font-body text-dash-muted bg-white/5 px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <p className="font-display text-2xl text-dash-text">
        {value}<span className="text-sm text-dash-muted ml-0.5">{unit}</span>
      </p>
      {subtitle && <p className="font-body text-xs text-dash-muted mt-1">{subtitle}</p>}
    </div>
  )
}

export default function DetailsPage({ data, airQuality, uvIndex, unit }) {
  if (!data) return null
  const { current } = data
  const speedLabel = unit === 'metric' ? 'km/h' : 'mph'
  const tempLabel = unit === 'metric' ? '°C' : '°F'

  const sunrise = new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const sunset = new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-4">
      <p className="font-display text-lg text-dash-text">Weather details</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard title="Temperature" value={convertTemp(current.temp, unit)} unit={tempLabel} subtitle={`Feels like ${convertTemp(current.feels_like, unit)}°`} />
        <DetailCard title="Wind" value={convertWindSpeed(current.wind_speed, unit)} unit={speedLabel} subtitle={`From ${current.wind_deg}°`} />
        <DetailCard title="Humidity" value={current.humidity} unit="%" />
        <DetailCard title="Pressure" value={current.pressure} unit="mb" />
        <DetailCard title="Visibility" value={current.visibility.toFixed(1)} unit="km" />
        <DetailCard
          title="UV index"
          value={uvIndex?.available ? uvIndex.uvi : '—'}
          unit=""
          badge="estimated"
        />
        <DetailCard
          title="Air quality"
          value={airQuality?.aqi ?? '—'}
          unit="/5"
          subtitle={airQuality?.label}
        />
        <DetailCard title="Sunrise" value={sunrise} unit="" />
        <DetailCard title="Sunset" value={sunset} unit="" />
      </div>

      <div className="bg-dash-panel border border-dash-border rounded-2xl p-4">
        <p className="font-body text-xs text-dash-muted">
          UV index is an estimate calculated from sun angle, season, and latitude — live measured UV
          requires a paid weather data subscription, which this project intentionally avoids.
        </p>
      </div>
    </div>
  )
}
