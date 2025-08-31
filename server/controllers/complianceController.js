const Acknowledgement = require('../models/Acknowledgement');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Training = require('../models/Training');

const getComplianceReport = async (req, res) => {
  const users = await User.find({ role: 'employee' });
  const report = await Promise.all(users.map(async (user) => {
    const policies = await Policy.find({ assignedDepartments: user.department });
    const trainings = await Training.find({ assignedDepartments: user.department });
    const acks = await Acknowledgement.find({ userId: user._id });
    const quizzes = await Quiz.find({ userId: user._id });

    let ackCount = 0;
    for (const policy of policies) {
      if (acks.some(a => a.policyId.toString() === policy._id.toString())) ackCount++;
    }

    let quizPassedCount = 0;
    for (const training of trainings) {
      if (quizzes.some(q => q.trainingId.toString() === training._id.toString() && q.passed)) quizPassedCount++;
    }

    const compliant = ackCount === policies.length && quizPassedCount === trainings.length;
    return { 
      user: user.username, 
      compliant, 
      acks: ackCount, 
      totalPolicies: policies.length,
      quizzesPassed: quizPassedCount,
      totalTrainings: trainings.length 
    };
  }));
  res.json(report);
};

module.exports = { getComplianceReport };