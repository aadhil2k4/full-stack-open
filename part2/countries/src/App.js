import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Content from './components/Content'

const App = () => {

  const [content, setdisplayContent] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [filtercountry, setFilteredCountry] = useState('')

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      console.log('data received')
      setAllCountries(prevAllCountries => {
        console.log('AllCountries: ', response.data);
        return response.data
      })
    })
  },[])

  const handleChange = (event) =>{
    console.log('handleChange triggered')
    const value = event.target.value
    setFilteredCountry(value)
    console.log('handleChange', value)
    console.log(value)
    if(value && allCountries.length>0){
      const regex = new RegExp(value, 'i')
      console.log(regex)
      console.log('AllCountries:', allCountries)
      const filteredcountries = () => allCountries.filter(country => country.name.common.match(regex))
      setdisplayContent(filteredcountries)
      console.log('Filetred countries',content)
    } else{
      setdisplayContent([])
    }
  }

  return (
    <div>
      find countries: <input value={filtercountry} onChange={handleChange} />
      <Content content={content} setdisplayContent={setdisplayContent} />
    </div>
  )
}

export default App