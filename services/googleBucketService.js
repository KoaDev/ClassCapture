const { bucket } = require('../config/googleCloud/googleBucketConfig');
const logger = require("../utils/logger");
const TranscriptionModel = require("../models/transcriptionModel");

const googleBucketService = {
    /**
     * Uploads a file to Google Cloud Storage.
     * @param {string} destinationPath - Destination path in the bucket.
     * @param {Buffer | string} content - File content to upload.
     * @param {object} options - Additional file options (e.g., metadata).
     * @returns {Promise<void>}
     * @throws {Error} - If the upload fails.
     */
    uploadFile: async (destinationPath, content, options = {}) => {
        try {
            // Valider que le contenu correspond au modèle
            const data = JSON.parse(content);
            await TranscriptionModel.validateAsync(data);

            const file = bucket.file(destinationPath);
            await file.save(content, {
                metadata: { contentType: 'application/json' },
                ...options,
            });
        } catch (error) {
            logger.error(`Error uploading file to Cloud Storage: ${error.message}`);
            throw new Error('Failed to upload file to Cloud Storage.');
        }
    },

    /**
     * Retrieves a file's content from Google Cloud Storage.
     * @param {string} filePath - The path of the file in the bucket.
     * @returns {Promise<string>} - The file's content as a string.
     * @throws {Error} - If file retrieval fails.
     */
    getFile: async (filePath) => {
        try {
            if (!filePath) {
                throw new Error('File path is required.');
            }

            const file = bucket.file(filePath);
            const [exists] = await file.exists();

            if (!exists) {
                logger.warn(`File not found: ${filePath}`);
                throw new Error('File not found.');
            }

            const [contents] = await file.download();
            return contents.toString();
        } catch (error) {
            logger.error(`Error retrieving file from Cloud Storage: ${error.message}`);
            throw new Error('Failed to retrieve file from Cloud Storage.');
        }
    },

    /**
     * Deletes a file from Google Cloud Storage.
     * @param {string} filePath - The path of the file to delete in the bucket.
     * @returns {Promise<void>}
     * @throws {Error} - If file deletion fails.
     */
    deleteFile: async (filePath) => {
        try {
            const file = bucket.file(filePath);
            await file.delete();
        } catch (error) {
            logger.error(`Error deleting file from Cloud Storage: ${error.message}`);
            throw new Error('Failed to delete file from Cloud Storage.');
        }
    },

    /**
     * Lists all files in the bucket with a specific prefix.
     * @param {string} prefix - The prefix to filter files in the bucket.
     * @returns {Promise<Array<object>>} - List of files with name and ID.
     * @throws {Error} - If listing files fails.
     */
    listFiles: async (prefix) => {
        try {
            const [files] = await bucket.getFiles({ prefix });

            return await Promise.all(
                files.map(async (file) => {
                    // Vérifiez que le fichier a un nom valide
                    if (!file.name) {
                        logger.warn(`Skipping file with missing name`);
                        return null;
                    }

                    try {
                        const fileContent = await googleBucketService.getFile(file.name);
                        const data = JSON.parse(fileContent);

                        // Valider chaque transcription
                        await TranscriptionModel.validateAsync(data);

                        return {
                            id: file.name.split('/').pop().replace('.json', ''),
                            ...data,
                        };
                    } catch (error) {
                        logger.warn(`Skipping invalid transcription file: ${file.name}`);
                        return null;
                    }
                })
            );
        } catch (error) {
            logger.error(`Error listing files from Cloud Storage: ${error.message}`);
            throw new Error('Failed to list files from Cloud Storage.');
        }
    },
};

module.exports = googleBucketService;
