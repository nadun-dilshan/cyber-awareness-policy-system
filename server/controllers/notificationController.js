const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
};

const markAsRead = async (req, res) => {
  const { id } = req.body;
  await Notification.findByIdAndUpdate(id, { read: true });
  res.json({ msg: 'Marked as read' });
};

module.exports = { getNotifications, markAsRead };