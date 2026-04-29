import './WeatherCard.css'

interface WeatherData {
  city: string
  country: string
  temp: number
  feels_like: number
  description: string
  icon: string
  humidity: number
  wind_speed: number
}

interface WeatherCardProps {
  data: WeatherData
  unit: 'celsius' | 'fahrenheit'
  isFavorite: boolean
  onToggleFavorite: () => void
}

const WeatherCard = ({ data, unit, isFavorite, onToggleFavorite }: WeatherCardProps) => {
  const formatTemp = (temp: number) =>
    unit === 'celsius' ? `${Math.round(temp)}°C` : `${Math.round(temp * 9/5 + 32)}°F`

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div>
          <h2 className="weather-city">{data.city}</h2>
          <span className="weather-country">{data.country}</span>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="weather-main">
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
        />
        <div>
          <p className="weather-temp">{formatTemp(data.temp)}</p>
          <p className="weather-desc">{data.description}</p>
          <p className="weather-feels">Ressenti {formatTemp(data.feels_like)}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-icon">💧</span>
          <span className="detail-label">Humidité</span>
          <span className="detail-value">{data.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-icon">🌬️</span>
          <span className="detail-label">Vent</span>
          <span className="detail-value">{data.wind_speed} km/h</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
export type { WeatherData }