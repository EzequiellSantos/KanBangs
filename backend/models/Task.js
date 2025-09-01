const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  title: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
