import WeatherIcon from './WeatherIcon'
import { getConditionCategory } from '../utils/formatters'

/**
 * DailyForecastStrip — horizontal row of day cards, MSN-style.
 * We show 5 days (not 7) since that's what the free forecast tier gives us.
 */
export default function DailyForecastStrip({ daily }) {
  if (!daily || daily.length === 0) return null

  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
      <p className="font-body text-xs text-dash-muted mb-4">5-day forecast</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {daily.map((day, i) => {
          const category = getConditionCategory(day.condition_code)
          const dayLabel = i === 0
            ? 'Today'
            : new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })
          return (
            <div key={day.date} className="flex flex-col items-center bg-dash-panel2 rounded-xl py-4 px-2">
              <p className="font-body text-xs text-dash-muted mb-2">{dayLabel}</p>
              <WeatherIcon category={category} size={36} />
              <p className="font-display text-sm text-dash-text mt-2">{day.temp_max}°</p>
              <p className="font-body text-xs text-dash-muted">{day.temp_min}°</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
