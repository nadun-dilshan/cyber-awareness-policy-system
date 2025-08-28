const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // URL or text
  department: { type: String },
  quizzes: [{ question: String, options: [String], answer: String }]
});

module.exports = mongoose.model('Training', trainingSchema);