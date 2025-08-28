const express = require('express');
const { register, login, completeOnboarding } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register',  register);
router.post('/login', login);
router.post('/onboarding', authMiddleware, completeOnboarding);

module.exports = router;