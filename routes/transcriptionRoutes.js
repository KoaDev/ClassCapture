const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcriptionController');
const validateRequest = require('../middleware/validateRequest');

router.post('/transcriptions', validateRequest, transcriptionController.createTranscription);

router.get('/transcriptions/:id', validateRequest, transcriptionController.getTranscription);

router.delete('/transcriptions/:id', validateRequest, transcriptionController.deleteTranscription);

router.get('/transcriptions', validateRequest, transcriptionController.listTranscriptions);

module.exports = router;
