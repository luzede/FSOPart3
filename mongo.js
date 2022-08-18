/* eslint-disable no-undef */
const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.u5siekd.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Please provide the password, name and a phone number as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

if (process.argv.length < 4) {
  mongoose.connect(url)
    .then(() => {
      console.log('connected to MongoDB')
      Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(0)
      })
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
      process.exit(1)
    })
}
else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}



