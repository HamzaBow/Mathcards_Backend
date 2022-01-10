const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  cardsIds: {
    type: Array,
    required: true
  },
  tags: {
    type: Array,
    required: true
  },
}, { timestamps: true })

module.exports = mongoose.model('Collection', collectionSchema)