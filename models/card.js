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
  difficultyLevels: {
    type: Object,
    required: false
  },
  tags: {
    type: Array,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)