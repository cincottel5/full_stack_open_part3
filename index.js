const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send({message: 'server running', time: new Date()})
})

app.get('/info', (request, response) => {
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `

  response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find( p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const getRandomId = () => {
  const minCeiled = Math.ceil(0)
  const maxFloored = Math.floor(10000000)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) 
    return response.status(400).json({error: 'name or number is missing'})

  const name = body.name

  if (persons.find(p => p.name === name))
    return response.status(400).json({error: 'name must be unique'})

  const person = {
    id: getRandomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})


const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

