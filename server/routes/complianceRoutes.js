const express = require('express');
const { getComplianceReport } = require('../controllers/complianceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/report', authMiddleware, roleMiddleware(['admin']), getComplianceReport);

module.exports = router;