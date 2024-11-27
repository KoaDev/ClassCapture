const logger = require('../utils/logger');
const firebaseService = require('../services/firebaseService');
const UserModel = require('../models/userModel');

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
 * Handles user signup.
 * Creates a new user with Firebase Authentication and initializes user-specific folders in cloud storage.
 */
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        await UserModel.validateAsync({ email, password });

        const { user, idToken } = await firebaseService.signupUser(email, password);

        const userData = {
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
        };

        res.status(201).json({
            message: 'User created successfully',
            idToken,
            user: userData,
        });
    } catch (error) {
        handleError(res, error, 'Failed to sign up user');
    }
};


/**
 * Handles user login.
 * Authenticates the user with Firebase Authentication and retrieves a token.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        await UserModel.validateAsync({ email, password });

        const { user, idToken } = await firebaseService.loginUser(email, password);

        res.status(200).json({
            message: 'Login successful',
            idToken,
            user: {
                uid: user.uid,
                email: user.email,
                lastLoginAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        handleError(res, error, 'Failed to log in user');
    }
};


module.exports = {
    signupUser,
    loginUser,
};
