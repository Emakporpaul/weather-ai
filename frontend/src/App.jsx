import { useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useAirQuality, useUvIndex, useDailyForecast } from './hooks/useExtras'
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

export default function App() {
  const [coords, setCoords] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [activeTab, setActiveTab] = useState('current')

  const { data, isLoading, isError } = useWeather(coords?.lat, coords?.lon)
  const { data: airQuality, isLoading: aqLoading } = useAirQuality(coords?.lat, coords?.lon)
  const { data: uvIndex, isLoading: uvLoading } = useUvIndex(coords?.lat, coords?.lon)
  const { data: dailyData } = useDailyForecast(coords?.lat, coords?.lon)

  function handleLocationFound(lat, lon) {
    setCoords({ lat, lon })
  }

  return (
    <div className="min-h-screen bg-dash-bg flex">
      <Sidebar active={activeTab} onSelect={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onLocationFound={handleLocationFound} unit={unit} onUnitChange={setUnit} />

        <main className="flex-1 px-5 py-6 max-w-5xl w-full mx-auto">
          <h1 className="font-display text-2xl font-medium text-dash-text mb-6">
            Welcome to Paulo Weather Forecast
          </h1>

          {!coords && (
            <p className="text-center font-body text-dash-muted text-sm py-24">
              Search a city or use your location to see the forecast
            </p>
          )}

          {isLoading && (
            <p className="text-center font-body text-dash-muted text-sm py-24">
              Fetching weather...
            </p>
          )}

          {isError && (
            <p className="text-center font-body text-red-400 text-sm py-24">
              Couldn't load weather for that location. Try again.
            </p>
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

          {data && activeTab === 'hourly' && (
            <HourlyPage data={data} unit={unit} />
          )}

          {data && activeTab === 'details' && (
            <DetailsPage data={data} airQuality={airQuality} uvIndex={uvIndex} unit={unit} />
          )}

          {data && activeTab === 'monthly' && (
            <MonthlyPage daily={dailyData?.daily} />
          )}

          {data && activeTab === 'trends' && (
            <TrendsPage daily={dailyData?.daily} />
          )}
        </main>
      </div>
    </div>
  )
}
