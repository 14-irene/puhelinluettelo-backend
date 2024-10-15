require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const mongoose = require('mongoose')

const token = morgan.token('body', (req, res) => req.method == 'POST'
  ? JSON.stringify(req.body)
  : ' '
)

const errorHandler = (e, req, res, n) => {
  console.error(e.message)
  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (e.name === 'MissingContent') {
    return res.status(400).send({ error: 'missing content' })
  }
  n(e)
}

const unknownEndpoint = (req, res) => 
  res.status(404).send({ error: 'unknown endpoint' })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

app.get('/api/persons', (req, res) => Person.find({}).then(p => res.json(p)))
app.get('/api/persons/:id', (req, res, n) => {
  Person.findById(req.params.id)
    .then(p => {
      if (p) res.json(p) 
      else res.status(404).end()
    })
    .catch(e => n(e))
})

app.get('/info', (req, res) => {
  Person.find({}).then(p => {
    const len = p.length
    const date = new Date(Date.now()).toString()
    res.send(`
      <div>
        <p>
          Phonebook has info for ${len} people<br/>
          ${date}
        </p>
      </div>`
    )
  })
})

app.post('/api/persons', (req, res, n) => {
  const [name, number] = Object.values(req.body)
  const person = new Person({ name, number })
  try {
    if (!name || !number) throw "MissingContent"
    person.save().then(p =>  res.json(p))
  } catch (e) { n(e) }
})

app.put('/api/persons/:id', (req, res, n) => {
  const number = req.body
  const id = req.params.id
  console.log('update request with data', number, id)
  try {
    if (!number) throw "MissingContent"
    Person
      .findByIdAndUpdate(id, req.body)
      .then(d => {
        console.log(d ? `successfully updated: ${d.name}` : 'update failed')
        res.json(d)
      })
  } catch (e) { n(e) }
})
  

app.delete('/api/persons/:id', (req, res, n) => {
  Person.findByIdAndDelete(req.params.id)
    .then(r => res.status(204).end())
    .catch(e => n(e))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server running at port ${PORT}`))
