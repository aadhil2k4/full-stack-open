require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person')

const morgan = require('morgan')
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if(!name || !number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  /*const existingPerson = persons.find(person => person.name === body.name)
  if(existingPerson){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/

  const person = new Person({ name, number })
  person.save().then(person => {
    response.json(person)
  })
  .catch(error => {
    response.status(400).send({ error: error.message })
  }
  )
})

/*app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})*/

app.get('/api/persons', (request, response, next) => {
  Person
  .find({})
  .then(result => {
    response.json(result)
  })
  .catch(error =>
    next(error)
  )
})

app.get('/api/persons/:id', (request, response,next) => {
    Person
    .findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else{
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  })

app.get('/info', (request, response,next) => {
  Person
  .find({})
  .then(result => {
    response.send(`
    <p>Phonebook has info for ${result.length} people </p>
    <p>${Date()}</p>
    `)
  })
  .catch(error =>
    next(error)
  )
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person
  .findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error =>
    next(error)
  )
  //const id = Number(request.params.id)
  //persons = persons.filter(person => person.id !== id)
  //response.status(204).end()
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})