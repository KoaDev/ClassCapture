const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcriptionController');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * /api/transcriptions:
 *   post:
 *     summary: Create a transcription
 *     description: Creates a new transcription for the authenticated user.
 *     tags:
 *       - Transcriptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transcriptionText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transcription created successfully.
 *       400:
 *         description: Invalid input.
 */
router.post('/transcriptions', validateRequest, transcriptionController.createTranscription);

/**
 * @swagger
 * /api/transcriptions/{id}:
 *   get:
 *     summary: Get transcription by ID
 *     description: Retrieves the transcription details by its ID.
 *     tags:
 *       - Transcriptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Transcription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the transcription.
 *       404:
 *         description: Transcription not found.
 */
router.get('/transcriptions/:id', validateRequest, transcriptionController.getTranscription);

/**
 * @swagger
 * /api/transcriptions/{id}:
 *   delete:
 *     summary: Delete transcription by ID
 *     description: Deletes a transcription by its ID.
 *     tags:
 *       - Transcriptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Transcription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the transcription.
 *       404:
 *         description: Transcription not found.
 */
router.delete('/transcriptions/:id', validateRequest, transcriptionController.deleteTranscription);

/**
 * @swagger
 * /api/transcriptions:
 *   get:
 *     summary: List all transcriptions
 *     description: Lists all transcriptions created by the authenticated user.
 *     tags:
 *       - Transcriptions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of transcriptions.
 *       404:
 *         description: No transcriptions found.
 */
router.get('/transcriptions', validateRequest, transcriptionController.listTranscriptions);

module.exports = router;
