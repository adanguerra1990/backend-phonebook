const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGOOSE_URI

console.log('Conectando...', url)

mongoose.connect(url)
    .then(result => {
        console.log('Conectado a MongoDB')
    })
    .catch((error) => {
        console.log('Error de conexion con MongoDB', error)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                 // Expresión regular para validar el formato del número de teléfono
                return /^(\d{2,3}-\d+)$/.test(v)              
            },
            message: props => `${props.value} no es un número de teléfono válido`
        },
        require: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)