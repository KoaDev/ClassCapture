const googleGeminiService = require('../services/googleGeminiService');
const googleBucketService = require('../services/googleBucketService');
const logger = require("../utils/logger");
const TranscriptionModel = require("../models/transcriptionModel");

/**
 * Handles errors and sends a consistent response.
 * @param {object} res - Express response object.
 * @param {Error} error - Error object.
 * @param {string} customMessage - Custom error message for the client.
 */
const handleError = (res, error, customMessage) => {
    logger.error(`${customMessage}: ${error.message}`);
    res.status(500).json({ error: customMessage });
};

/**
 * Creates a transcription with contextual information using Gemini AI.
 * Stores the generated transcription in cloud storage.
 */
const createTranscription = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text in request body' });
        }

        const userId = req.user.uid;
        const transcriptionId = `transcription_${Date.now()}`;
        const destinationPath = `TranscriptionWithContext/${userId}/${transcriptionId}.json`;

        const generatedText = await googleGeminiService.generateContent(
            `Voici une transcription speech to text... ${text}`
        );

        const transcriptionData = {
            id: transcriptionId,
            uid: userId,
            text: generatedText,
            createdAt: new Date().toISOString(),
            path: destinationPath,
            metadata: {
                size: Buffer.byteLength(JSON.stringify(generatedText)),
                contentType: 'application/json',
            },
        };

        await TranscriptionModel.validateAsync(transcriptionData);

        await googleBucketService.uploadFile(destinationPath, JSON.stringify(transcriptionData));

        res.status(201).json({
            message: 'Transcription created successfully',
            transcription: transcriptionData,
        });
    } catch (error) {
        handleError(res, error, 'Failed to create transcription');
    }
};

/**
 * Retrieves a transcription by its ID.
 */
const getTranscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const filePath = `TranscriptionWithContext/${userId}/${id}.json`;

        const fileContent = await googleBucketService.getFile(filePath);
        const transcription = JSON.parse(fileContent);

        await TranscriptionModel.validateAsync(transcription);

        res.status(200).json({
            message: 'Transcription retrieved successfully',
            transcription,
        });
    } catch (error) {
        handleError(res, error, 'Failed to retrieve transcription');
    }
};

/**
 * Deletes a transcription by its ID.
 */
const deleteTranscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const filePath = `TranscriptionWithContext/${userId}/${id}.json`;

        await googleBucketService.deleteFile(filePath);

        res.status(200).json({ message: 'Transcription deleted successfully', id });
    } catch (error) {
        handleError(res, error, 'Failed to delete transcription');
    }
};

/**
 * Lists all transcriptions for the authenticated user.
 */
const listTranscriptions = async (req, res) => {
    try {
        const userId = req.user.uid;
        const prefix = `TranscriptionWithContext/${userId}/`;

        const files = await googleBucketService.listFiles(prefix);

        const transcriptions = await Promise.all(
            files.map(async (file) => {
                if (!file) return null;

                try {
                    const fileContent = await googleBucketService.getFile(file.path || file.name);
                    const transcription = JSON.parse(fileContent);

                    await TranscriptionModel.validateAsync(transcription);

                    return transcription;
                } catch (error) {
                    logger.warn(`Skipping invalid transcription file: ${file.name}`);
                    return null;
                }
            })
        );

        const validTranscriptions = transcriptions.filter(Boolean);

        res.status(200).json({
            message: 'Transcriptions retrieved successfully',
            transcriptions: validTranscriptions,
        });
    } catch (error) {
        handleError(res, error, 'Failed to list transcriptions');
    }
};

module.exports = {
    createTranscription,
    getTranscription,
    deleteTranscription,
    listTranscriptions,
};
