const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
  score: { type: Number },
  passed: { type: Boolean },
  attempts: { type: Number, default: 1 },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Quiz', quizSchema);