import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar/Navbar'
import SearchBar from '../components/Searchbar/SearchBar'
import WeatherCard from '../components/WeatherCard/WeatherCard'
import ForecastCard from '../components/ForecastCard/ForecastCard'
import FavoritesList from '../components/FavoritesList/FavoritesList'
import type { WeatherData } from '../components/WeatherCard/WeatherCard'
import type { ForecastDay } from '../components/ForecastCard/ForecastCard'
import type { Favorite } from '../components/FavoritesList/FavoritesList'
import './HomePage.css'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const HomePage = () => {
  const { user } = useAuth()

  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecasts, setForecasts] = useState<ForecastDay[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les favoris au démarrage
  useEffect(() => {
    if (user) fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    if (data) setFavorites(data)
  }

  const handleSearch = async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      // Météo actuelle
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
      )
      if (!weatherRes.ok) throw new Error('Ville introuvable')
      const weatherData = await weatherRes.json()

      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        wind_speed: Math.round(weatherData.wind.speed * 3.6),
      })

      // Prévisions 5 jours
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
      )
      const forecastData = await forecastRes.json()

      // On garde 1 entrée par jour (à midi)
      const daily: ForecastDay[] = forecastData.list
        .filter((item: any) => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
        .map((item: any) => ({
          date: item.dt_txt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        }))

      setForecasts(daily)

      // Sauvegarder dans l'historique
      await supabase.from('search_history').insert({
        user_id: user!.id,
        city_name: weatherData.name,
        country_code: weatherData.sys.country,
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = weather
    ? favorites.some((f) => f.city_name === weather.city)
    : false

  const handleToggleFavorite = async () => {
    if (!weather) return

    if (isFavorite) {
      const fav = favorites.find((f) => f.city_name === weather.city)
      if (fav) await handleRemoveFavorite(fav.id)
    } else {
      await supabase.from('favorites').insert({
        user_id: user!.id,
        city_name: weather.city,
        country_code: weather.country,
        lat: 0,
        lon: 0,
      })
      fetchFavorites()
    }
  }

  const handleRemoveFavorite = async (id: string) => {
    await supabase.from('favorites').delete().eq('id', id)
    fetchFavorites()
  }

  return (
    <div className="home-page">
      <Navbar />

      {<main className="home-main">
        <div className="home-search-section">
          <h2 className="home-greeting">Bonjour {user?.username} 👋</h2>
          <p className="home-subtitle">Quelle ville voulez-vous consulter ?</p>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && <div className="home-error">⚠️ {error}</div>}

        <div className="home-content">
          {weather && (
            <WeatherCard
              data={weather}
              unit={user?.preferred_unit ?? 'celsius'}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {forecasts.length > 0 && (
            <ForecastCard
              forecasts={forecasts}
              unit={user?.preferred_unit ?? 'celsius'}
            />
          )}

          <FavoritesList
            favorites={favorites}
            onSelect={handleSearch}
            onRemove={handleRemoveFavorite}
          />
        </div>
      </main>}
    </div>
  )
}

export default HomePage
