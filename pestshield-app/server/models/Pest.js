const mongoose = require('mongoose');

const pestSchema = new mongoose.Schema({
  pestName: { type: String, required: true },
  crop: { type: String, enum: ['Groundnut', 'Potato', 'Chilli'], required: true },
  description: { type: String },
  symptoms: { type: String },
  treatment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Pest', pestSchema);
