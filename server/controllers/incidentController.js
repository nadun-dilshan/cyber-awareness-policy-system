const Incident = require('../models/Incident');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

const submitIncident = async (req, res) => {
  const { title, description } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const incident = new Incident({ userId: req.user.id, title, description, fileUrl });
  await incident.save();
  await new AuditLog({ userId: req.user.id, action: 'incident_submitted', details: title }).save();

  // Notify admin
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await new Notification({ userId: admin._id, type: 'incident_update', message: `New incident: ${title}` }).save();
  }

  res.status(201).json(incident);
};

const getIncidents = async (req, res) => {
  const incidents = await Incident.find(); // Admin only
  res.json(incidents);
};

const updateIncidentStatus = async (req, res) => {
  const { id, status } = req.body;
  const incident = await Incident.findByIdAndUpdate(id, { status }, { new: true });
  await new AuditLog({ userId: req.user.id, action: 'incident_updated', details: `ID: ${id}, Status: ${status}` }).save();
  res.json(incident);
};

module.exports = { submitIncident, getIncidents, updateIncidentStatus };