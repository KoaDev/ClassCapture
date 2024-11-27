const express = require('express');
const authRoutes = require('./authRoutes');
const transcriptionRoutes = require('./transcriptionRoutes');

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   description: Authentication routes
 *   tags:
 *     - Auth
 */
router.use('/auth', authRoutes);

/**
 * @swagger
 * /api:
 *   description: Transcription API routes
 *   tags:
 *     - Transcriptions
 */
router.use('/api', transcriptionRoutes);

module.exports = router;
