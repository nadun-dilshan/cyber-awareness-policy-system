const Training = require('../models/Training');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const createTraining = async (req, res) => {
  const { title, content, assignedDepartments, quizzes } = req.body;
  const parsedDepartments = JSON.parse(assignedDepartments);
  const parsedQuizzes = JSON.parse(quizzes);
  const training = new Training({ title, content, assignedDepartments: parsedDepartments, quizzes: parsedQuizzes });
  await training.save();
  await new AuditLog({ userId: req.user.id, action: 'training_created', details: title }).save();
  res.status(201).json(training);
};

const getTrainings = async (req, res) => {
  const trainings = await Training.find({ assignedDepartments: req.user.department });
  res.json(trainings);
};

const getAllTrainings = async (req, res) => {
  const trainings = await Training.find();
  res.json(trainings);
};

const submitQuiz = async (req, res) => {
  const { trainingId, answers } = req.body;
  const training = await Training.findById(trainingId);
  let score = 0;
  training.quizzes.forEach((q, i) => {
    if (q.answer === answers[i]) score++;
  });
  const passed = score >= training.quizzes.length * 0.8; // 80% pass
  const quizResult = new Quiz({ userId: req.user.id, trainingId, score, passed, completedAt: Date.now() });
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

const getMyQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ userId: req.user.id }).populate('trainingId', 'title').sort({ completedAt: -1 });
  res.json(quizzes);
};

module.exports = { createTraining, getTrainings, submitQuiz, getMyQuizzes, getAllTrainings };