const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  authId: {
    type: String,
    required: true
  },
  following: {
    type: Array,
    required: true,
  },
  collectionsIds: {
    type: Array,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)