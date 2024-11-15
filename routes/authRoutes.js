const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signupUser);

router.post('/login', authController.loginUser);

router.post('/verifyToken', verifyToken, authController.verifyToken);

router.delete('/deleteUser', verifyToken, authController.deleteUser);

module.exports = router;
