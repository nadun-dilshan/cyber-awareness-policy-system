const mongoose = require('mongoose');

const trainingResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  training: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingResult', trainingResultSchema);