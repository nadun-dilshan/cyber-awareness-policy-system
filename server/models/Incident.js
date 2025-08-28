const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String },
  status: { type: String, enum: ['new', 'in-review', 'resolved'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);