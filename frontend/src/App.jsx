import { useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useAirQuality, useUvIndex, useDailyForecast } from './hooks/useExtras'
import { humanizeError } from './utils/formatters'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import HeroWeatherCard from './components/HeroWeatherCard'
import { AirQualityCard, UvIndexCard } from './components/StatCards'
import HourlyTabs from './components/HourlyTabs'
import AiForecast from './components/AiForecast'
import DailyForecastStrip from './components/DailyForecastStrip'
import HourlyPage from './components/HourlyPage'
import DetailsPage from './components/DetailsPage'
import MonthlyPage from './components/MonthlyPage'
import TrendsPage from './components/TrendsPage'

// Ping the backend every 10 minutes to prevent Render's free tier from sleeping.
// Render sleeps after 15 minutes of inactivity — this keeps it warm.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
setInterval(() => {
  fetch(`${API_URL}/api/health`).catch(() => {})
}, 10 * 60 * 1000)

export default function App() {
  const [coords, setCoords] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [activeTab, setActiveTab] = useState('current')
  const [menuOpen, setMenuOpen] = useState(false)

  const { data, isLoading, isError, error } = useWeather(coords?.lat, coords?.lon)
  const { data: airQuality, isLoading: aqLoading } = useAirQuality(coords?.lat, coords?.lon)
  const { data: uvIndex, isLoading: uvLoading } = useUvIndex(coords?.lat, coords?.lon)
  const { data: dailyData } = useDailyForecast(coords?.lat, coords?.lon)

  function handleLocationFound(lat, lon) {
    setCoords({ lat, lon })
    setActiveTab('current')
  }

  return (
    <div className="min-h-screen bg-dash-bg flex">
      <Sidebar
        active={activeTab}
        onSelect={setActiveTab}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onLocationFound={handleLocationFound}
          unit={unit}
          onUnitChange={setUnit}
          onMenuOpen={() => setMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 max-w-5xl w-full mx-auto">

          {/* Heading + app description */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-medium text-dash-text">
              Welcome to Paulo Weather Forecast
            </h1>
            <p className="font-body text-sm text-dash-muted mt-1 max-w-xl">
              Real-time weather forecasts for any city, state, or country worldwide —
              powered by live data and AI-generated insights tailored to your conditions.
              Search above or tap the pin to use your current location.
            </p>
          </div>

          {!coords && (
            <div className="rounded-2xl bg-dash-panel border border-dash-border p-8 text-center">
              <p className="font-display text-lg text-dash-text mb-2">Search anywhere on earth</p>
              <p className="font-body text-sm text-dash-muted">
                Try "Lagos", "London", "New York", "Accra" or any city worldwide.
                The app covers all countries and regions globally.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="rounded-2xl bg-dash-panel border border-dash-border p-8 text-center">
              <p className="font-body text-sm text-dash-muted">Fetching weather data...</p>
            </div>
          )}

          {isError && (
            <div className="rounded-2xl bg-dash-panel border border-dash-border p-8 text-center">
              <p className="font-display text-base text-red-400 mb-1">Oops, something went wrong</p>
              <p className="font-body text-sm text-dash-muted">
                {humanizeError(error)} Please try searching again.
              </p>
            </div>
          )}

          {data && activeTab === 'current' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <HeroWeatherCard data={data} unit={unit} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <AirQualityCard data={airQuality} loading={aqLoading} />
                <UvIndexCard data={uvIndex} loading={uvLoading} />
              </div>
              <div className="lg:col-span-3">
                <HourlyTabs forecast={data.forecast} unit={unit} />
              </div>
              <div className="lg:col-span-3">
                <AiForecast weatherData={data} />
              </div>
              <div className="lg:col-span-3">
                <DailyForecastStrip daily={dailyData?.daily} />
              </div>
            </div>
          )}

          {data && activeTab === 'hourly' && <HourlyPage data={data} unit={unit} />}
          {data && activeTab === 'details' && (
            <DetailsPage data={data} airQuality={airQuality} uvIndex={uvIndex} unit={unit} />
          )}
          {data && activeTab === 'monthly' && <MonthlyPage daily={dailyData?.daily} />}
          {data && activeTab === 'trends' && <TrendsPage daily={dailyData?.daily} />}
        </main>
      </div>
    </div>
  )
}
