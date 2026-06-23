/**
 * Utility formatters — keep components clean by moving formatting here
 */

export const msToKmh = (ms) => Math.round(ms * 3.6)
export const msToMph = (ms) => Math.round(ms * 2.237)

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

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32)

/**
 * Convert a temperature value based on the selected unit
 * All data from OWM comes in Celsius (metric units)
 */
export const convertTemp = (celsius, unit) =>
  unit === 'imperial' ? celsiusToFahrenheit(celsius) : Math.round(celsius)

/**
 * Convert wind speed from km/h (our normalized value) to mph for imperial
 */
export const convertWindSpeed = (kmh, unit) =>
  unit === 'imperial' ? Math.round(kmh * 0.621371) : kmh

/**
 * Humanize fetch/API errors into user-friendly messages
 * Keeps JSON and technical details away from the user
 */
export const humanizeError = (error, context = 'weather') => {
  const msg = error?.message?.toLowerCase() || ''
  if (msg.includes('not found') || msg.includes('404')) {
    return context === 'location'
      ? "We couldn't find that location. Try a city name like \"Lagos\" or \"London\"."
      : "No weather data available for this location right now. Try again shortly."
  }
  if (msg.includes('network') || msg.includes('failed to fetch')) {
    return "Connection issue — please check your internet and try again."
  }
  return "Something went wrong. Please try again in a moment."
}
