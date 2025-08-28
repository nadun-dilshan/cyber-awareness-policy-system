const express = require('express');
const { uploadPolicy, getPolicies, acknowledgePolicy } = require('../controllers/policyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', authMiddleware, roleMiddleware(['admin']), upload.single('file'), uploadPolicy);
router.get('/', authMiddleware, getPolicies);
router.post('/acknowledge', authMiddleware, acknowledgePolicy);

module.exports = router;