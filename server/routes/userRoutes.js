const express = require('express');
const { createUser, deleteUser, getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();


router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;