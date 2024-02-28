const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    } 

    next(error)
}

const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(requestLogger)

const morgan = require('morgan')

app.use(morgan('tiny'))
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status - :response-time ms :body'));

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/info/', (request, response, next) => {
    const date = new Date()
    // Verificar la cantidada de personas almacenadas en BD
    Person.countDocuments({})
        .then(totalPersons => {
            response.send(`
                <p>Phonebook has info ${totalPersons} peoples</p> 
                <p>${date}</p>
            `)
        })
        .catch(error => next(error))
})

app.get('/api/persons/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

     // Buscar en la base de datos una persona con el mismo nombre
     Person.findOne({ name: body.name })
     .then(person => {
         if (person) {
             // Si la persona ya existe, devolver un error
             return response.status(400).json({
                 error: 'name must be unique'
             });
         } else {
             // Si no existe, crear la nueva persona
             const person = new Person({
                 name: body.name,
                 number: body.number,
             });
             // Guardar la nueva persona en la base de datos
             return person.save();
         }
     })
     .then(savedPerson => {
         response.json(savedPerson);
     })
     .catch(error => next(error));
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.status(204).end()
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number} = request.body    

    Person.findByIdAndUpdate(
        request.params.id, 
        {name, number}, 
        { new: true, runValidators: true, context: 'query'}
    )
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})