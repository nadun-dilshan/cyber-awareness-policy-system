const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 });
  res.json(logs);
};

module.exports = { getAuditLogs };