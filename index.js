const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

// morgan('tiny')

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    return response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json("Fail to add person. Data is empty!")
    }
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json("Fail to add person. Person already exists!")
    }
    newPerson = {
        id: String(Math.round(Math.random()*10000)),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    return response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
        return response.json(person)
    }
    else{
        return response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    return response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const peopleCount = persons.length
    const currentDate = new Date().toString()
    return response.send(`
        <p>Phonebook has info for ${peopleCount} people(s)</p>
        <p>${currentDate}</p>
    `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

