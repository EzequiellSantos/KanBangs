const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }]
  // outros campos...
})

module.exports = mongoose.model('Board', boardSchema)
