const cloudStorageService = require('../services/googleBucketService');
const logger = require('../utils/logger');
const firebaseService = require('../services/firebaseService');

/**
 * Handles user signup.
 * Creates a new user with Firebase Authentication and initializes user-specific folders in cloud storage.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            logger.warn('Signup failed: Missing email or password', { ip: userIp });
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { user, idToken } = await firebaseService.signupUser(email, password);
        const folderPath = `TranscriptionWithContext/${user.uid}/`;
        await cloudStorageService.uploadFile(`${folderPath}placeholder.txt`, '');

        return res.status(201).json({
            message: 'User created successfully, and folders initialized',
            idToken,
            uid: user.uid,
        });
    } catch (error) {
        logger.error(`Signup Error: ${error.message}`);
        return res.status(500).json({ error: 'Failed to create user. Please try again later.' });
    }
};

/**
 * Handles user login.
 * Authenticates the user with Firebase Authentication and retrieves a token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            logger.warn('Login failed: Missing email or password', { ip: userIp });
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { user, idToken } = await firebaseService.loginUser(email, password);

        return res.status(200).json({
            message: 'Login successful',
            idToken,
            uid: user.uid,
        });
    } catch (error) {
        logger.error(`Login Error: ${error.message}`);
        return res.status(401).json({ error: 'Invalid email or password' });
    }
};

module.exports = {
    signupUser,
    loginUser,
};
