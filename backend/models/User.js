const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // será vazio se OAuth
  provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
  providerId: { type: String }, // id do Google ou GitHub
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
