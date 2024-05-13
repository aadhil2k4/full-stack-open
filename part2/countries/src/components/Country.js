import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Country = ({country}) => {

  const {capitalInfo: {latlng: [latitude, longitude]}} = country
  const [weather, setWeather] = useState(null)
  const [icon, setIcon] = useState(null)

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
        const iconResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
        console.log('Weather data received: ', response.data)
        setWeather(response.data)
        setIcon(iconResponse.data)
      } catch (error){
        console.error('Error fetching data: ',error)
      }
    }
    fetchData()
  }, [latitude, longitude])

  return (
    <div>
        <h1>{country.name.common}</h1>
        <p>capital: {country.capital}</p>
        <p>area: {country.area}</p>
        <h3>languages:</h3>
        {Object.values(country.languages).map((language, index) => 
            <li key={index}>{language}</li>
        )}
        <img src={country.flags.svg} style ={{marginTop: "1rem", width: "150px"}} alt="Flag"/>
       {weather ? (<div> <h3>Weather in {country.capital}</h3>
        <p>{weather.current.temp}</p>
        <img src={icon.icon} alt="Weather icon"/>
        <p>{weather.current.wind_speed}</p> </div>) : (<p>Loading weather data</p>) }
    </div>
  )
}

export default Country