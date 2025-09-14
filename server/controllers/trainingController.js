const Training = require('../models/Training');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const TrainingResult = require('../models/TrainingResult');

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

// const submitQuiz = async (req, res) => {
//   const { trainingId, answers } = req.body;
//   const training = await Training.findById(trainingId);
//   let score = 0;
//   training.quizzes.forEach((q, i) => {
//     if (q.answer === answers[i]) score++;
//   });
//   const passed = score >= training.quizzes.length * 0.8; // 80% pass
//   const quizResult = new Quiz({ userId: req.user.id, trainingId, score, passed, completedAt: Date.now() });
//   await quizResult.save();

//   // Update user progress
//   const user = await User.findById(req.user.id);
//   const progressIndex = user.progress.findIndex(p => p.trainingId.toString() === trainingId);
//   if (progressIndex > -1) {
//     user.progress[progressIndex].completed = passed;
//     user.progress[progressIndex].score = score;
//   } else {
//     user.progress.push({ trainingId, completed: passed, score });
//   }
//   await user.save();

//   await new AuditLog({ userId: req.user.id, action: 'quiz_submitted', details: `Training: ${trainingId}, Score: ${score}` }).save();
//   res.json({ score, passed });
// };

const getMyQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ userId: req.user.id }).populate('trainingId', 'title').sort({ completedAt: -1 });
  res.json(quizzes);
};


const getTrainingResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await TrainingResult.find()
      .populate('user', 'username')
      .populate('training', 'title')
      .skip(skip)
      .limit(limit);

    res.json(results);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getMyTrainingResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await TrainingResult.find({ user: req.user._id })
      .populate('training', 'title')
      .skip(skip)
      .limit(limit);

    res.json(results);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update submitQuiz to create TrainingResult

const submitQuiz = async (req, res) => {
  const { trainingId, answers } = req.body;

  if (!(trainingId)) {
    return res.status(400).json({ msg: "Invalid trainingId" });
  }

  try {
    const training = await Training.findById(trainingId);
    if (!training) {
      return res.status(404).json({ msg: 'Training not found' });
    }

    // Calculate score
    let correct = 0;
    training.quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.answer) correct++;
    });

    const score = Math.round((correct / training.quizzes.length) * 100);
    const passed = score >= 70;

    const result = new TrainingResult({
      user: req.user.id,
      training: trainingId,
      score,
      passed,
      completedAt: new Date()
    });

    await result.save();
    res.json({ msg: 'Quiz submitted successfully', score, passed });
  } catch (error) {
    console.error(error); // log actual error
    res.status(500).json({ msg: 'Server error' });
  }
};


module.exports = { createTraining, getTrainings, submitQuiz, getMyQuizzes, getAllTrainings, getTrainingResults, getMyTrainingResults };