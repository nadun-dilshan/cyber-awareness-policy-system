const Acknowledgement = require('../models/Acknowledgement');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Policy = require('../models/Policy');

const getComplianceReport = async (req, res) => {
  const users = await User.find({ role: 'employee' });
  const report = await Promise.all(users.map(async (user) => {
    const acks = await Acknowledgement.find({ userId: user._id });
    const quizzes = await Quiz.find({ userId: user._id });
    const policies = await Policy.find({ assignedTo: user._id });
    const compliant = acks.length === policies.length && quizzes.every(q => q.passed);
    return { user: user.username, compliant, acks: acks.length, quizzesPassed: quizzes.filter(q => q.passed).length };
  }));
  res.json(report);
};

module.exports = { getComplianceReport };