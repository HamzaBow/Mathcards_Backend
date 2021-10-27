const mongoose = require('mongoose');

// const faceSchema = new mongoose.Schema({
//   type
// })
const difficultyLevelsSchema = new mongoose.Schema({
  veryEasy: {
    type: Boolean,
    required: false
  },
  easy: {
    type: Boolean,
    required: false
  },
  medium: {
    type: Boolean,
    required: false
  },
  hard: {
    type: Boolean,
    required: false
  },
  veryHard: {
    type: Boolean,
    required: false
  },
})

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
    type: difficultyLevelsSchema,
    required: false
  },
  tags: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Card', cardSchema)