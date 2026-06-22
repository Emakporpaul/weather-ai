import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatDay } from '../utils/formatters'

/**
 * TrendsPage — honest partial version of MSN's 12-month trends chart.
 * True historical trend data requires a paid OWM subscription, so instead
 * of faking a year of data, we show the real 5-day high/low trend we do
 * have and clearly label why the full year isn't available.
 */
export default function TrendsPage({ daily }) {
  if (!daily || daily.length === 0) return null

  const chartData = daily.map((d) => ({
    day: formatDay(d.dt),
    high: d.temp_max,
    low: d.temp_min,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-dash-text">Weather trends</p>
        <span className="text-[11px] font-body text-dash-muted bg-white/5 px-2.5 py-1 rounded-full">
          5-day real trend
        </span>
      </div>

      <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
        <p className="font-body text-xs text-dash-muted mb-3">Daily high / low (°)</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5B544" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F5B544" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8DEF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5B8DEF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C9BC2' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C9BC2' }} width={28} />
            <Tooltip
              contentStyle={{
                borderRadius: 12, border: '1px solid #28395C', background: '#1C2D4D',
                fontSize: 13, color: '#E8EDF7',
              }}
            />
            <Area type="monotone" dataKey="high" stroke="#F5B544" strokeWidth={2} fill="url(#highGradient)" />
            <Area type="monotone" dataKey="low" stroke="#5B8DEF" strokeWidth={2} fill="url(#lowGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-dash-panel border border-dash-border rounded-2xl p-4">
        <p className="font-body text-xs text-dash-muted">
          MSN's trends view compares against 12 months of historical data, which needs a paid
          OpenWeatherMap subscription. This chart instead shows the real 5-day high/low trend from
          our free forecast data — accurate, just shorter range.
        </p>
      </div>
    </div>
  )
}
