/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
const errorHandler = require('./errorHandler.js')

morgan.token('body', function (req, _res) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//Welcome
app.get('/', (_req, res) => {
  res.send('<h1>Sneaking around to find data, are not we?</h1>')
})

//Get info
app.get('/info', (_req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  }).catch(error => next(error))
})

//Get all
app.get('/api/persons', (_req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next(error))
})

//Get one
app.get('/api/persons/:id', (req, res, next) => {
  Person.find({}).then(persons => {
    const person = persons.find(person => {
      return person.id === req.params.id
    })
    if (person) {
      res.json(person)
    } else {
      res.status(404).send('Not found')
    }
  }).catch((err) => {
    next(err)
  })

})

//Delete
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).end()
      }
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => {
    next(error)
  })

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  Person.findByIdAndUpdate(req.params.id,
    { name: body.name, number: body.number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => {next(error)})
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log('Server running on port ', PORT) })