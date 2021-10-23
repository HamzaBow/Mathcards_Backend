const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: {
    type: Array,
    required: true
  },
  back: {
    type: Array,
    required: false
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Card', cardSchema)