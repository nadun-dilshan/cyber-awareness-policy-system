const express = require('express');
const { createTraining, getTrainings, submitQuiz, getMyQuizzes, getAllTrainings, getTrainingResults, getMyTrainingResults } = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), createTraining);
router.get('/all', authMiddleware, getAllTrainings);
router.get('/', authMiddleware, getTrainings);
router.post('/quiz', authMiddleware, submitQuiz);
router.get('/quizzes', authMiddleware, getMyQuizzes);
router.get('/results', authMiddleware, roleMiddleware(['admin']), getTrainingResults);
router.get('/my-results', authMiddleware, getMyTrainingResults);

module.exports = router;