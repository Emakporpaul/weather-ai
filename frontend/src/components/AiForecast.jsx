import { useState, useEffect } from 'react'
import { getAiForecast } from '../services/ai'

/**
 * AiForecast — the one genuinely "AI engineering" piece of this app.
 * Streams Gemini's response word-by-word as it arrives, then parses the
 * final JSON into a summary, a Now/Next24h/Outlook breakdown, and
 * practical tips (umbrella, sunscreen, etc.) based on live conditions.
 */
export default function AiForecast({ weatherData }) {
  const [rawText, setRawText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!weatherData) return
    setRawText('')
    setParsed(null)
    setError(null)
    setLoading(true)

    getAiForecast(
      weatherData,
      (chunk) => setRawText((prev) => prev + chunk),
      (fullText) => {
        setLoading(false)
        setError(null)
        try {
          const clean = fullText.replace(/```json|```/g, '').trim()
          setParsed(JSON.parse(clean))
        } catch {
          // If parsing fails, we just show the raw streamed text
        }
      }
    ).catch(() => {
      setLoading(false)
      setError('Could not generate AI forecast right now')
    })
  }, [weatherData])

  if (!weatherData) return null

  return (
    <div className="bg-dash-panel border border-dash-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <p className="font-body text-xs text-dash-muted">AI forecast</p>
      </div>

      {error && <p className="text-sm text-red-400 font-body">{error}</p>}

      {!parsed && !error && (
        <p className="font-body text-[15px] leading-relaxed text-dash-text/90 whitespace-pre-wrap">
          {rawText.replace(/```json|```/g, '').trim() || (loading ? 'Generating your forecast...' : '')}
          {loading && <span className="inline-block w-1.5 h-4 bg-dash-muted ml-0.5 animate-pulse" />}
        </p>
      )}

      {parsed && (
        <div className="space-y-4">
          <p className="font-body text-[15px] leading-relaxed text-dash-text">
            {parsed.summary}
          </p>

          <div className="space-y-2 pt-3 border-t border-dash-border">
            <div className="flex gap-2 text-sm">
              <span className="font-medium text-dash-muted shrink-0">Now —</span>
              <span className="text-dash-text/90 font-body">{parsed.structured?.current}</span>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="font-medium text-dash-muted shrink-0">Next 24h —</span>
              <span className="text-dash-text/90 font-body">{parsed.structured?.next24h}</span>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="font-medium text-dash-muted shrink-0">Outlook —</span>
              <span className="text-dash-text/90 font-body">{parsed.structured?.outlook}</span>
            </div>
          </div>

          {parsed.tips?.length > 0 && (
            <div className="pt-3 border-t border-dash-border">
              <p className="font-body text-xs text-dash-muted mb-2">What to do today</p>
              <ul className="space-y-1.5">
                {parsed.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm font-body text-dash-text/80">
                    <span className="text-dash-accent">·</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
