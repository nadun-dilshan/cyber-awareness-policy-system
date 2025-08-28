const Policy = require('../models/Policy');
const Acknowledgement = require('../models/Acknowledgement');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const path = require('path');

const uploadPolicy = async (req, res) => {
  const { title, description, assignedTo } = req.body; // assignedTo is array of user IDs
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const policy = new Policy({ title, description, fileUrl, assignedTo: JSON.parse(assignedTo) });
  await policy.save();
  await new AuditLog({ userId: req.user.id, action: 'policy_uploaded', details: title }).save();

  // Send notifications
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  for (const userId of policy.assignedTo) {
    const user = await User.findById(userId);
    if (user) {
      await new Notification({ userId, type: 'policy_update', message: `New policy: ${title}` }).save();
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.username + '@example.com', // Assume username is email prefix; adjust as needed
        subject: 'New Policy Update',
        text: `Please acknowledge the new policy: ${title}`
      });
    }
  }

  res.status(201).json(policy);
};

const getPolicies = async (req, res) => {
  const policies = await Policy.find({ assignedTo: req.user.id });
  res.json(policies);
};

const acknowledgePolicy = async (req, res) => {
  const { policyId, signature } = req.body;
  const ack = new Acknowledgement({ userId: req.user.id, policyId, signature });
  await ack.save();
  await new AuditLog({ userId: req.user.id, action: 'policy_acknowledged', details: policyId }).save();
  res.json({ msg: 'Policy acknowledged' });
};

module.exports = { uploadPolicy, getPolicies, acknowledgePolicy };