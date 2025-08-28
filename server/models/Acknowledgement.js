const mongoose = require('mongoose');

const acknowledgementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  timestamp: { type: Date, default: Date.now },
  signature: { type: String } // e-sign placeholder
});

module.exports = mongoose.model('Acknowledgement', acknowledgementSchema);