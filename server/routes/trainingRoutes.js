const express = require('express');
const { createTraining, getTrainings, submitQuiz, getMyQuizzes } = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), createTraining);
router.get('/', authMiddleware, getTrainings);
router.post('/quiz', authMiddleware, submitQuiz);
router.get('/quizzes', authMiddleware, getMyQuizzes);

module.exports = router;