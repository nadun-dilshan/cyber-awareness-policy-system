const Training = require('../models/Training');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const createTraining = async (req, res) => {
  const { title, content, department, quizzes } = req.body;
  const training = new Training({ title, content, department, quizzes });
  await training.save();
  await new AuditLog({ userId: req.user.id, action: 'training_created', details: title }).save();
  res.status(201).json(training);
};

const getTrainings = async (req, res) => {
  const trainings = await Training.find({ department: req.user.department });
  res.json(trainings);
};

const submitQuiz = async (req, res) => {
  const { trainingId, answers } = req.body; // answers: array of user choices
  const training = await Training.findById(trainingId);
  let score = 0;
  training.quizzes.forEach((q, i) => {
    if (q.answer === answers[i]) score++;
  });
  const passed = score >= training.quizzes.length * 0.8; // 80% pass
  const quizResult = new Quiz({ userId: req.user.id, trainingId, score, passed });
  await quizResult.save();

  // Update user progress
  const user = await User.findById(req.user.id);
  const progressIndex = user.progress.findIndex(p => p.trainingId.toString() === trainingId);
  if (progressIndex > -1) {
    user.progress[progressIndex].completed = passed;
    user.progress[progressIndex].score = score;
  } else {
    user.progress.push({ trainingId, completed: passed, score });
  }
  await user.save();

  await new AuditLog({ userId: req.user.id, action: 'quiz_submitted', details: `Training: ${trainingId}, Score: ${score}` }).save();
  res.json({ score, passed });
};

module.exports = { createTraining, getTrainings, submitQuiz };