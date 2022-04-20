const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  ownerId: {
    type: 'string',
    required: true
  },
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

cardSchema.index({ "front.htmlContent": "text", "front.latex": "text", "back.htmlContent": "text", "back.latex": "text", "tags": "text" })

module.exports = mongoose.model('Card', cardSchema)