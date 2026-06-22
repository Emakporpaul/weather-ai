import { useState } from 'react'
import WeatherIcon from './WeatherIcon'
import HourlyTabs from './HourlyTabs'
import { formatTime, getConditionCategory } from '../utils/formatters'

/**
 * HourlyPage — dedicated Hourly view (sidebar destination).
 * Reuses the HourlyTabs chart and adds a List view alongside it,
 * mirroring MSN's Chart/List toggle.
 */
export default function HourlyPage({ data, unit }) {
  const [view, setView] = useState('chart')
  if (!data) return null

  const unitLabel = unit === 'metric' ? '°' : '°'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-dash-text">Hourly forecast</p>
        <div className="flex items-center gap-1 bg-dash-panel rounded-full p-1 border border-dash-border">
          <button
            onClick={() => setView('chart')}
            className={`px-3 py-1 rounded-full text-xs font-body transition-colors ${view === 'chart' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
          >
            Chart
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-full text-xs font-body transition-colors ${view === 'list' ? 'bg-dash-accent text-dash-bg font-medium' : 'text-dash-muted'}`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'chart' && <HourlyTabs forecast={data.forecast} unit={unit} />}

      {view === 'list' && (
        <div className="bg-dash-panel border border-dash-border rounded-2xl divide-y divide-dash-border">
          {data.forecast.slice(0, 8).map((f) => {
            const category = getConditionCategory(f.condition_code)
            return (
              <div key={f.dt} className="flex items-center justify-between px-5 py-3">
                <span className="font-body text-sm text-dash-muted w-16">{formatTime(f.dt)}</span>
                <WeatherIcon category={category} size={28} />
                <span className="font-body text-xs text-dash-muted capitalize flex-1 px-3">{f.condition}</span>
                <span className="font-body text-xs text-dash-muted w-16 text-right">{f.pop}% rain</span>
                <span className="font-display text-sm text-dash-text w-12 text-right">{f.temp}{unitLabel}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
