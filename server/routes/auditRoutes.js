const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getAuditLogs);

module.exports = router;