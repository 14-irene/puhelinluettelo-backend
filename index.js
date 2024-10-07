const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const token = morgan.token('body', (req, res) => req.method == 'POST'
  ? JSON.stringify(req.body)
  : ' '
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "404-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-235345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => res.json(persons))
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(n => n.id === req.params.id)
  if (person) res.json(person)
  else res.status(404).send('<h1>404</h1>')
})

app.get('/info', (request, response) => {
  response.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people<br/>
      ${new Date(Date.now()).toString()}</p>
    </div>`
  )
})

app.post('/api/persons', (req, res) => {
  const newId = () => `${Math.floor(Math.random() * Math.pow(10, 16))}`
  const newPerson = {id: newId(), ...req.body}
  if (newPerson) {
    if (persons.map(p => p.name).includes(newPerson.name)) {
      return res.status(400).json({error: 'name must be unique'})
    }
    else if (newPerson.name && newPerson.number) {
      persons = persons.concat(newPerson) 
      res.json(newPerson)
    }
    else res.status(400).json({error: 'bad data'})
  }
  else res.status(400).json({error: 'no data'})

})
  

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(n => n.id !== req.params.id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`palvelin portissa ${PORT}`))
