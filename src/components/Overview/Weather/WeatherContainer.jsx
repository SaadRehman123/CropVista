import axios from 'axios'
import React, { useEffect, useState } from 'react'

import FormBackground from '../../SupportComponents/FormBackground'

const WeatherContainer = () => {

    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    
    useEffect(() => {
        const savedLocation = localStorage.getItem('location')
        if (savedLocation) {
            setLocation(savedLocation)
            fetchWeatherData(savedLocation)
        }
    }, [])

    const toDateFunction = () => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const WeekDays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ]
        const currentDate = new Date()
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`
        return date
    }

    const fetchWeatherData = (location) => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=b0f7fc60bbb229754a12c0988ae080f8`).then((response) => {
            setData(response.data)
        })
    }

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            fetchWeatherData(location)
            localStorage.setItem('location', location)
        }
    }

    const renderForcast = () => {
        
        const convertFtoC = (tempF) => {
            return ((tempF - 32) * 5 / 9).toFixed(1)
        }

        return (
            <div className='weather-background'>
                <div className="search-location">
                    <input
                        type="text"
                        value={location}
                        onKeyPress={searchLocation}
                        placeholder='Enter Location'
                        style={{ textAlign: "center" }}
                        onChange={event => setLocation(event.target.value)} />
                </div>
                <div className="container">
                    <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between" }} className="top">
                        <div>
                            <div className="location">
                                <h3>{data.name}</h3>
                            </div>
                            <div className="temp">
                                {data.main ? <h1>{convertFtoC(data.main.temp)}°C</h1> : null}
                            </div>
                        </div>
                        <div className="dashboard-date" style={{ display: "grid", justifyItems: "center" }}>
                            <i class="fas fa-clouds-sun" style={{fontSize: 50}} />
                            <span>{toDateFunction()}</span>
                        </div>
                        <div className="description" style={{ display: "flex", alignContent: "center", alignItems: "center" }}>
                            {data.weather && (
                                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt={data.weather[0].description} />
                            )}
                            {data.weather ? <h3 style={{marginTop: 30, marginRight: 15}}>{data.weather[0].main}</h3> : null}
                        </div>
                    </div>
                    {data.name !== undefined &&
                        <div className="bottom">
                            <div className="feels">
                                {data.main ? <h5 className='bold'>{convertFtoC(data.main.feels_like)}°C</h5> : null}
                                <p>Feels Like</p>
                            </div>
                            <div className="humidity">
                                {data.main ? <h5 className='bold'>{data.main.humidity}%</h5> : null}
                                <p>Humidity</p>
                            </div>
                            <div className="wind">
                                {data.wind ? <h5 className='bold'>{data.wind.speed.toFixed()} MPH</h5> : null}
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <FormBackground Form={[renderForcast()]} />
    )
}

export default WeatherContainer
