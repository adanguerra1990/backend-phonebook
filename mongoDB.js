const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Ingrese la contraseña')
    console.log('va..', process.argv.length < 3)
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ajguerra160790:${password}@cluster0.wiq0mn5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 4){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(result => {
        console.log('nota guardada!')
        mongoose.connection.close()
    }).catch(error => {
        console.log('Error al guardar', error)
        mongoose.connection.close()
    })
} else {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
