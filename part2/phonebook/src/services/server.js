import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  const response = await request
    return response.data
}

const Delete = async (id) =>{
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
    return response.data
}

const phoneBook = {getAll, create, Delete, update}

export default phoneBook
