const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcriptionController');

const verifyToken = require('../middleware/authMiddleware');

router.post('/transcriptions', verifyToken, transcriptionController.createTranscription);

router.get('/transcriptions/:id', verifyToken, transcriptionController.getTranscription);

router.delete('/transcriptions/:id', verifyToken, transcriptionController.deleteTranscription);

router.get('/transcriptions', verifyToken, transcriptionController.listTranscriptions);

module.exports = router;