import React from 'react'
import Country from './Country'

const Content = ({content, setdisplayContent}) => {

if(content.length>10){

  return (
    <p>
      Too many matches, specify another filter  
    </p>
  )
}
else if(content.length>1 || content.length===0){
    return(
        content.map((country, index)=>
        <li key={index}>{country.name.common} <button onClick={()=>setdisplayContent([country])}>show</button></li>
        )
    )
}
else{
    return(
        <Country country={content[0]} />
    )
}
}

export default Content