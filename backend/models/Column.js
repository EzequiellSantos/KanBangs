const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true
  },
  title: {
    type: String, required: true
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: [] }]
}, { timestamps: true });

module.exports = mongoose.model('Column', columnSchema);
