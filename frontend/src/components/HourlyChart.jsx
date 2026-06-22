import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatTime } from '../utils/formatters'

/**
 * HourlyChart — 24-hour temperature curve.
 * Deliberately minimal: no gridlines, no Y-axis numbers cluttering the view,
 * just the shape of the day.
 */
export default function HourlyChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null

  const chartData = forecast.slice(0, 8).map((f) => ({
    time: formatTime(f.dt),
    temp: f.temp,
  }))

  return (
    <div className="rounded-2xl bg-white/50 p-4">
      <p className="font-body text-xs uppercase tracking-wide text-ink/50 mb-2">
        Next 24 hours
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F2733" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#1F2733" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#1F273380' }}
            interval={1}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              fontSize: 13,
            }}
            formatter={(value) => [`${value}°`, 'Temp']}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#1F2733"
            strokeWidth={2}
            fill="url(#tempGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
