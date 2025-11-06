import React, { useEffect, useState } from 'react'
import '../styles/WeatherModule.css'

// Using OpenWeatherMap directly via fetch
const OWM_KEY = '80ecff6edc35e9b81544e7dd55d2e242'

export default function WeatherModule(){
  const [city, setCity] = useState('London')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (c = city) => {
    setIsLoading(true)
    setError('')
    setData(null)

    try {
      const q = encodeURIComponent(c)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${OWM_KEY}&units=metric`
      const resp = await fetch(url)
      if (!resp.ok) {
        if (resp.status === 404) throw new Error('City not found')
        throw new Error(`HTTP ${resp.status}`)
      }
      const json = await resp.json()

      const temperature = json.main && json.main.temp
      const condition = json.weather && json.weather[0] && json.weather[0].description
      const wind_m_s = json.wind && json.wind.speed
      const wind_kmh = wind_m_s ? (wind_m_s * 3.6).toFixed(1) : null
      const humidity = json.main && json.main.humidity

      setData({
        city: json.name,
        temperature,
        condition,
        windspeed: wind_kmh,
        humidity
      })
    } catch (err) {
      setError('Could not load weather: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{ fetchWeather() }, [])

  return (
    <div className="weather-module">
      <h2>Weather Forecast</h2>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name (e.g. London)"
          onKeyDown={e => { if (e.key === 'Enter') fetchWeather(city) }}
        />
        <button onClick={() => fetchWeather(city)} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load'}
        </button>
      </div>
      {isLoading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="weather-data">
          <p className="temp">{data.temperature}°C</p>
          <p className="description">{data.condition}</p>
          <p><strong>City:</strong> {data.city}</p>
          {data.humidity != null && <p><strong>Humidity:</strong> {data.humidity}%</p>}
          {data.windspeed != null && <p><strong>Wind:</strong> {data.windspeed} km/h</p>}
        </div>
      )}
    </div>
  )
}
