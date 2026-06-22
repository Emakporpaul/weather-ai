/**
 * Utility formatters — keep components clean by moving formatting here
 */
export const msToKmh = (ms) => Math.round(ms * 3.6)

export const formatTime = (unixTs) =>
  new Date(unixTs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const formatDay = (unixTs) =>
  new Date(unixTs * 1000).toLocaleDateString([], { weekday: 'short' })

export const getConditionCategory = (code) => {
  if (code >= 200 && code < 300) return 'thunderstorm'
  if (code >= 300 && code < 600) return 'rain'
  if (code >= 600 && code < 700) return 'snow'
  if (code >= 700 && code < 800) return 'fog'
  if (code === 800) return 'clear'
  if (code > 800) return 'cloudy'
  return 'unknown'
}
