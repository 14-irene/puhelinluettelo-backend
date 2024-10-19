const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('connected to mongoDB'))
  .catch((e) => console.log(`error connecting to mongoDB: ${e.message}`))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length >= 8 ? /^\d{2,3}-\d+/.test(v) : false
      },
      message: props => `${props.value} is not a valid number`
    },
    required: [true, 'number required']
  }
})

personSchema.set('toJSON', {
  transform: (d, r) => {
    r.id = r._id.toString()
    delete r._id
    delete r.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

