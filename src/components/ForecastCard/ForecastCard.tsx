import './ForecastCard.css'

interface ForecastDay {
  date: string
  temp_min: number
  temp_max: number
  description: string
  icon: string
}

interface ForecastCardProps {
  forecasts: ForecastDay[]
  unit: 'celsius' | 'fahrenheit'
}

const ForecastCard = ({ forecasts, unit }: ForecastCardProps) => {
  const formatTemp = (temp: number) =>
    unit === 'celsius' ? `${Math.round(temp)}°C` : `${Math.round(temp * 9/5 + 32)}°F`

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  }

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">Prévisions 5 jours</h3>
      <div className="forecast-list">
        {forecasts.map((day, index) => (
          <div key={index} className="forecast-day" style={{ animationDelay: `${index * 0.07}s` }}>
            <span className="forecast-date">{formatDay(day.date)}</span>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
            />
            <span className="forecast-desc">{day.description}</span>
            <div className="forecast-temps">
              <span className="temp-max">{formatTemp(day.temp_max)}</span>
              <span className="temp-min">{formatTemp(day.temp_min)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard
export type { ForecastDay }