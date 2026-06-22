/**
 * WeatherIcon — the signature visual element of the app.
 * Instead of static icon packs, these breathe and drift gently,
 * giving the sky a sense of being alive rather than a frozen snapshot.
 */
export default function WeatherIcon({ category, size = 64 }) {
  const common = { width: size, height: size, viewBox: '0 0 100 100' }

  switch (category) {
    case 'clear':
      return (
        <svg {...common} className="animate-breathe">
          <circle cx="50" cy="50" r="22" fill="#F5B544" />
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8
            const x1 = 50 + 30 * Math.cos((angle * Math.PI) / 180)
            const y1 = 50 + 30 * Math.sin((angle * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos((angle * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin((angle * Math.PI) / 180)
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#F5B544" strokeWidth="4" strokeLinecap="round" />
            )
          })}
        </svg>
      )

    case 'cloudy':
      return (
        <svg {...common}>
          <g className="animate-drift">
            <ellipse cx="40" cy="55" rx="26" ry="16" fill="#B9C4D4" />
            <ellipse cx="60" cy="48" rx="20" ry="14" fill="#CCD5E1" />
          </g>
        </svg>
      )

    case 'rain':
      return (
        <svg {...common}>
          <ellipse cx="48" cy="42" rx="26" ry="16" fill="#9AA7BD" />
          {[30, 45, 60, 70].map((x, i) => (
            <line key={i} x1={x} y1="62" x2={x - 4} y2="74"
              stroke="#5B7BA6" strokeWidth="3" strokeLinecap="round"
              className="animate-fall" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </svg>
      )

    case 'thunderstorm':
      return (
        <svg {...common}>
          <ellipse cx="48" cy="40" rx="26" ry="15" fill="#6B7585" />
          <polygon points="50,55 40,75 48,75 42,92 62,68 52,68 58,55"
            fill="#F5B544" className="animate-breathe" />
        </svg>
      )

    case 'snow':
      return (
        <svg {...common}>
          <ellipse cx="48" cy="40" rx="26" ry="15" fill="#C5D1DE" />
          {[32, 48, 64].map((x, i) => (
            <text key={i} x={x} y="75" fontSize="16" fill="#7FA3D1"
              className="animate-fall" style={{ animationDelay: `${i * 0.3}s` }}>❄</text>
          ))}
        </svg>
      )

    case 'fog':
      return (
        <svg {...common}>
          {[35, 48, 61].map((y, i) => (
            <line key={i} x1="20" y1={y} x2="80" y2={y}
              stroke="#B9C4D4" strokeWidth="5" strokeLinecap="round"
              className="animate-drift" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </svg>
      )

    default:
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="20" fill="#CCD5E1" />
        </svg>
      )
  }
}
