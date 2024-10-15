const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(r => console.log('connected to mongoDB'))
  .catch((e) => console.log(`error connecting to mongoDB: ${e.message}`))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (d, r) => {
    r.id = r._id.toString()
    delete r._id
    delete r.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

