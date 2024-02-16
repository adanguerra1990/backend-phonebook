const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/info/', (request, response) => {
    const date = new Date()
    const totalPersons = persons.length
    response.send(`
        <p>Phonebook has info ${totalPersons} peoples</p> 
        <p>${date}</p>
    `)
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)    
    const person = persons.find(person => {
        // console.log('person.id', typeof person.id, 'id', typeof id, person.id === id )
        return person.id === id
    } )

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)    
    const person = persons.filter(person => person.id !== id)

    console.log('delete..', person)
    response.status(204).end()
})

const generarId = (min, max) => {
    
    return  Math.floor((Math.random() * (max - min + 1)) + min)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generarId(0, 1000)
    }
    console.log('newPerson..', person)

    persons = persons.concat(person)
    
    response.json(person)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server Running on Port ${PORT}`)