/**
 * AirQualityCard + UvIndexCard — small side stat panels, MSN-style.
 * AQI uses a 1-5 color scale; UV is clearly labeled "Estimated" since
 * it's calculated from sun angle rather than pulled from a paid live feed.
 */

const AQI_COLORS = {
  1: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  2: { bg: 'bg-lime-500/15', text: 'text-lime-400', dot: 'bg-lime-400' },
  3: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  4: { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400' },
  5: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
}

export function AirQualityCard({ data, loading }) {
  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
      <p className="font-body text-xs text-dash-muted mb-3">Air quality</p>
      {loading && <p className="font-body text-sm text-dash-muted">Loading...</p>}
      {!loading && data && (
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${AQI_COLORS[data.aqi]?.dot || 'bg-dash-muted'}`} />
          <div>
            <p className="font-display text-xl text-dash-text">{data.aqi}<span className="text-sm text-dash-muted">/5</span></p>
            <p className={`font-body text-xs ${AQI_COLORS[data.aqi]?.text || 'text-dash-muted'}`}>{data.label}</p>
          </div>
        </div>
      )}
      {!loading && !data && <p className="font-body text-sm text-dash-muted">Unavailable</p>}
    </div>
  )
}

export function UvIndexCard({ data, loading }) {
  const uvLevel = (uvi) => {
    if (uvi <= 2) return { label: 'Low', color: 'text-emerald-400' }
    if (uvi <= 5) return { label: 'Moderate', color: 'text-amber-400' }
    if (uvi <= 7) return { label: 'High', color: 'text-orange-400' }
    if (uvi <= 10) return { label: 'Very High', color: 'text-red-400' }
    return { label: 'Extreme', color: 'text-purple-400' }
  }

  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
      <p className="font-body text-xs text-dash-muted mb-3">UV index <span className="opacity-60">· estimated</span></p>
      {loading && <p className="font-body text-sm text-dash-muted">Loading...</p>}
      {!loading && data?.available && (
        <div>
          <p className="font-display text-xl text-dash-text">{data.uvi}</p>
          <p className={`font-body text-xs ${uvLevel(data.uvi).color}`}>{uvLevel(data.uvi).label}</p>
        </div>
      )}
      {!loading && !data?.available && <p className="font-body text-sm text-dash-muted">Unavailable</p>}
    </div>
  )
}
