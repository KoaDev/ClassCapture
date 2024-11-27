const googleGeminiService = require('../services/googleGeminiService');
const googleBucketService = require('../services/googleBucketService');
const logger = require("../utils/logger");

/**
 * Creates a transcription with contextual information using Gemini AI.
 * Stores the generated transcription in cloud storage.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const createTranscription = async (req, res) => {
    try {
        const { transcriptionText } = req.body;

        if (!transcriptionText) {
            return res.status(400).json({ error: 'Missing transcriptionText in request body' });
        }

        const userId = req.user.uid;
        const transcriptionId = `transcription_${Date.now()}`;
        const destinationPath = `TranscriptionWithContext/${userId}/${transcriptionId}.json`;

        const generatedText = await googleGeminiService.generateContent(
            `Voici une transcription speech to text... ${transcriptionText}`
        );

        const transcriptionData = {
            transcriptionText: generatedText,
            createdAt: new Date().toISOString(),
        };

        await googleBucketService.uploadFile(destinationPath, JSON.stringify(transcriptionData));

        return res.status(201).json({
            message: 'Transcription created successfully',
            id: transcriptionId,
            transcriptionText: generatedText,
        });
    } catch (error) {
        logger.error(`Create Transcription Error: ${error.message}`);
        return res.status(500).json({ error: 'Failed to create transcription. Please try again later.' });
    }
};

/**
 * Retrieves a transcription by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const getTranscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const filePath = `TranscriptionWithContext/${userId}/${id}.json`;

        const fileContent = await googleBucketService.getFile(filePath);
        const transcription = JSON.parse(fileContent);

        return res.status(200).json({
            id,
            transcriptionText: transcription.transcriptionText,
        });
    } catch (error) {
        logger.error(`Get Transcription Error: ${error.message}`);
        return res.status(404).json({ error: 'Transcription not found' });
    }
};

/**
 * Deletes a transcription by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteTranscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const filePath = `TranscriptionWithContext/${userId}/${id}.json`;

        await googleBucketService.deleteFile(filePath);

        return res.status(200).json({ message: 'Transcription deleted successfully', id });
    } catch (error) {
        logger.error(`Delete Transcription Error: ${error.message}`);
        return res.status(500).json({ error: 'Failed to delete transcription' });
    }
};

/**
 * Lists all transcriptions for the authenticated user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const listTranscriptions = async (req, res) => {
    try {
        const userId = req.user.uid;
        const prefix = `TranscriptionWithContext/${userId}/`;

        const files = await googleBucketService.listFiles(prefix);

        const transcriptions = files.map((file) => ({
            id: file.id,
            name: file.name,
        }));

        return res.status(200).json({
            message: 'Transcriptions retrieved successfully',
            transcriptions,
        });
    } catch (error) {
        logger.error(`List Transcriptions Error: ${error.message}`);
        return res.status(500).json({ error: 'Failed to list transcriptions' });
    }
};

module.exports = {
    createTranscription,
    getTranscription,
    deleteTranscription,
    listTranscriptions,
};
