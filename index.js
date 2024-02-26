require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status - :response-time ms :body'));

let persons = [
]

app.get('/info/', (request, response) => {
    const date = new Date()
    const totalPersons = Person.length
    response.send(`
        <p>Phonebook has info ${totalPersons} peoples</p> 
        <p>${date}</p>
    `)
})

app.get('/api/persons/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)    
//     const person = persons.find(person => {
//         // console.log('person.id', typeof person.id, 'id', typeof id, person.id === id )
//         return person.id === id
//     } )

//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)    
//     persons = persons.filter(person => person.id !== id)

//     console.log('delete..', persons, id)
//     response.status(204).end()
// })

// const generarId = (min, max) => {    
//     return  Math.floor((Math.random() * (max - min + 1)) + min)
// }
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body    

    // Verificar si falta el nombre o el número
    if (!body.name === undefined || !body.number === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // Verificar si el nombre ya existe en la lista de personas
    const nameExists = persons.some(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    // Si todo está bien, crear la nueva persona
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    console.log('newPerson..', person)

    // Agregar la nueva persona a la lista
    // persons = persons.concat(person)
    
    // Responder con la nueva persona
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server Running on Port ${PORT}`)
})