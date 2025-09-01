const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  desc: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
