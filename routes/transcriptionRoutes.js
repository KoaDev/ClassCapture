const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcriptionController');

const verifyToken = require('../middleware/authMiddleware'); // Middleware pour protéger les routes

// Route pour créer une transcription
router.post('/transcriptions', verifyToken, transcriptionController.createTranscription);

// Route pour récupérer une transcription par ID
router.get('/transcriptions/:id', verifyToken, transcriptionController.getTranscription);

// Route pour supprimer une transcription par ID
router.delete('/transcriptions/:id', verifyToken, transcriptionController.deleteTranscription);

// Route pour lister toutes les transcriptions
router.get('/transcriptions', verifyToken, transcriptionController.listTranscriptions);

module.exports = router;