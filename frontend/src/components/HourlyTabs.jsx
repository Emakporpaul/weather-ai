import { useState } from 'react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatTime } from '../utils/formatters'

const TABS = ['Overview', 'Wind', 'Humidity']

/**
 * HourlyTabs — tab-switchable hourly chart, MSN-style.
 * Overview shows temp, Wind shows wind speed, Humidity shows humidity %.
 * Each tab reuses the same chart shape with a different dataKey for consistency.
 */
export default function HourlyTabs({ forecast, unit }) {
  const [tab, setTab] = useState('Overview')
  if (!forecast || forecast.length === 0) return null

  const chartData = forecast.slice(0, 8).map((f) => ({
    time: formatTime(f.dt),
    temp: f.temp,
    wind_speed: f.wind_speed,
    humidity: f.humidity,
  }))

  const dataKey = tab === 'Overview' ? 'temp' : tab === 'Wind' ? 'wind_speed' : 'humidity'
  const unitLabel = tab === 'Overview' ? (unit === 'metric' ? '°C' : '°F') : tab === 'Wind' ? (unit === 'metric' ? 'km/h' : 'mph') : '%'

  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors
              ${tab === t ? 'bg-dash-accent text-dash-bg font-medium' : 'bg-white/5 text-dash-muted hover:text-dash-text'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5B544" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#F5B544" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8C9BC2' }}
            interval={1}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #28395C',
              background: '#1C2D4D',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              fontSize: 13,
              color: '#E8EDF7',
            }}
            formatter={(value) => [`${value}${unitLabel}`, tab]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#F5B544"
            strokeWidth={2}
            fill="url(#dashGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
