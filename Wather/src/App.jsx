/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './style.css';
import rainyGirl from './images/Rainy girl.png';

function WeatherTemperature({ data }) {
  return (
    <div className="weather-temperature">
      <div className="box-1">
        <div className="spans">
          <span className="his">{data.date}</span>
          <span className="name">{data.location}</span>
        </div>
        <h2 className="temp">{data.temp}°C</h2>
      </div>
    </div>
  );
}

function WeatherDetails({ data }) {
  return (
    <div className="detailes">
      <div className="image">
          <img src={rainyGirl} alt="Rainy girl" />
      </div>
      <div className="text">
        <h2 className="the-day">{data.day}</h2>
        <span className="situation">{data.condition}</span>
      </div>
    </div>
  );
}

function WeatherForecast({ forecast }) {
  return (
    <div className="Weather-forecast">
      <div className="hourly-forecast">
        <ul className="all-day">
          {forecast.map((hour, index) => (
            <li key={index} className={index === 1 ? 'active' : ''}>
              <span>{hour.time}</span>
              <img src={hour.icon} alt="weather icon" />
              <span>{hour.temp}°C</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  const [weatherData, setWeatherData] = useState({
    location: '',
    date: '',
    temp: '',
    day: '',
    condition: '',
    forecast: [],
  });
  async function fetchWeather(index = 0) {
    const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=eda8d98890214bab926190059241708&q=30.788173466742045,31.003218931049286&days=3');
    const data = await response.json();

    const forecastDataAllDays = data.forecast.forecastday[index];

    const date = new Date(forecastDataAllDays.date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    setWeatherData({
      location: `${data.location.name}, ${data.location.country}`,
      date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      temp: data.current.temp_c,
      day: dayNames[date.getDay()],
      condition: data.current.condition.text,
      forecast: forecastDataAllDays.hour.slice(0, 8).map(hour => ({
        time: hour.time.slice(-5),
        icon: hour.condition.icon,
        temp: hour.temp_c,
      })),
    });
  }

  useEffect(() => {
    fetchWeather();
  }, []);
  
  return (
    <div className="container">
      <WeatherTemperature data={weatherData} />
      <WeatherDetails data={weatherData} />
      <div className="clouds"></div>
      <div className="days">
        <div className="day">
          <span className="pre" onClick={() => fetchWeather(2)}>Yesterday</span>
          <span className="today" onClick={() => fetchWeather(0)}>Today</span>
          <span className="next" onClick={() => fetchWeather(1)}>Tomorrow</span>
        </div>
        <WeatherForecast forecast={weatherData.forecast} />
      </div>
    </div>
  );
}

export default App;
