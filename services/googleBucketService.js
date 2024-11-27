const { bucket } = require('../config/googleCloud/googleBucketConfig');

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
            const file = bucket.file(destinationPath);
            await file.save(content, {
                metadata: { contentType: 'application/json' },
                ...options,
            });
            console.info(`File uploaded successfully to: ${destinationPath}`);
        } catch (error) {
            console.error(`Error uploading file to Cloud Storage: ${error.message}`);
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
            const file = bucket.file(filePath);
            const [exists] = await file.exists();

            if (!exists) {
                console.warn(`File not found: ${filePath}`);
                throw new Error('File not found.');
            }

            const [contents] = await file.download();
            console.info(`File retrieved successfully from: ${filePath}`);
            return contents.toString();
        } catch (error) {
            console.error(`Error retrieving file from Cloud Storage: ${error.message}`);
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
            console.info(`File deleted successfully from: ${filePath}`);
        } catch (error) {
            console.error(`Error deleting file from Cloud Storage: ${error.message}`);
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
            console.info(`Files listed successfully with prefix: ${prefix}`);

            return files.map((file) => ({
                name: file.name,
                id: file.name.split('/').pop().replace('.json', ''),
            }));
        } catch (error) {
            console.error(`Error listing files from Cloud Storage: ${error.message}`);
            throw new Error('Failed to list files from Cloud Storage.');
        }
    },
};

module.exports = googleBucketService;
