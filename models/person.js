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
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)