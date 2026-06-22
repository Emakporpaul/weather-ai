/**
 * AI Forecast Service
 * Reads the streaming plain-text response from our FastAPI backend
 * (which streams Gemini's output) chunk by chunk.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getAiForecast(weatherData, onChunk, onDone) {
  const res = await fetch(`${API_URL}/api/ai-forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weather: weatherData })
  })

  if (!res.ok) throw new Error('AI forecast failed')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    onChunk(chunk)
  }

  onDone(fullText)
}
