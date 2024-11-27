const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     description: Allows the user to sign up and create an account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/signup', authController.signupUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Allows the user to log in with credentials.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Unauthorized access.
 */
router.post('/login', authController.loginUser);

module.exports = router;
