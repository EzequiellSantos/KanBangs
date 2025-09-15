const mongoose = require('mongoose')
// const { use } = require('react')

const boardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  // outros campos...
})

module.exports = mongoose.model('Board', boardSchema)
