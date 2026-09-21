const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true },
  cropType: { type: String, enum: ['Groundnut', 'Potato', 'Chilli'], required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    district: { type: String },
  },
  sowingDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
