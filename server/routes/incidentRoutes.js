const express = require('express');
const { submitIncident, getIncidents, updateIncidentStatus, getMyIncidents } = require('../controllers/incidentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const router = express.Router();

router.post('/', authMiddleware, upload.single('file'), submitIncident);
router.get('/', authMiddleware, roleMiddleware(['admin']), getIncidents);
router.put('/status', authMiddleware, roleMiddleware(['admin']), updateIncidentStatus);
router.get('/my', authMiddleware, getMyIncidents);

module.exports = router;