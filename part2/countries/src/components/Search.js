import React from 'react'

const Search = ({filtercountry, handleChange}) => {
  return (
    <div>
        find countries <input value={filtercountry} onChange={handleChange}/>
    </div>
  )
}

export default Search