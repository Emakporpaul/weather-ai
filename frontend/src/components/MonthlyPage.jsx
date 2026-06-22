import WeatherIcon from './WeatherIcon'
import { getConditionCategory } from '../utils/formatters'

/**
 * MonthlyPage — honest partial version of MSN's monthly calendar.
 * Our free tier only gives 5 real forecast days; we show those with real
 * data and clearly mark the rest of the month as unavailable rather than
 * fabricating numbers.
 */
export default function MonthlyPage({ daily }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthName = today.toLocaleDateString([], { month: 'long', year: 'numeric' })

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = firstDay.getDay()

  const realDataByDate = {}
  daily?.forEach((d) => {
    const dateKey = new Date(d.dt * 1000).getDate()
    realDataByDate[dateKey] = d
  })

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-dash-text">{monthName}</p>
        <span className="text-[11px] font-body text-dash-muted bg-white/5 px-2.5 py-1 rounded-full">
          Free tier — 5 real days shown
        </span>
      </div>

      <div className="bg-dash-panel border border-dash-border rounded-2xl p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <p key={d} className="font-body text-[11px] text-dash-muted text-center">{d}</p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((dayNum, i) => {
            if (!dayNum) return <div key={i} />
            const real = realDataByDate[dayNum]
            const isToday = dayNum === today.getDate()
            return (
              <div
                key={i}
                className={`rounded-xl py-2.5 px-1 flex flex-col items-center gap-1 border
                  ${isToday ? 'border-dash-accent/50 bg-dash-accent/10' : 'border-transparent bg-dash-panel2'}
                  ${!real ? 'opacity-35' : ''}`}
              >
                <span className="font-body text-[11px] text-dash-muted">{dayNum}</span>
                {real ? (
                  <>
                    <WeatherIcon category={getConditionCategory(real.condition_code)} size={20} />
                    <span className="font-display text-[11px] text-dash-text">{real.temp_max}°</span>
                  </>
                ) : (
                  <span className="font-body text-[10px] text-dash-muted">—</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-dash-panel border border-dash-border rounded-2xl p-4">
        <p className="font-body text-xs text-dash-muted">
          OpenWeatherMap's free tier only provides a 5-day forecast. Full 30-day outlooks require a
          paid plan, so the remaining days are shown as unavailable rather than estimated or faked.
        </p>
      </div>
    </div>
  )
}
