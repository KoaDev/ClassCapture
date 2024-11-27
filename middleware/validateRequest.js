const firebaseService = require('../services/firebaseService');

/**
 * Middleware to validate Firebase ID tokens.
 * Extracts the token from the Authorization header, verifies it, and attaches the user data to `req.user`.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const validateRequest = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing Authorization header' });
        }

        if (!authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid Authorization header format. Expected "Bearer <token>"' });
        }

        const idToken = authorizationHeader.split('Bearer ')[1];
        if (!idToken) {
            return res.status(401).json({ error: 'Missing token after "Bearer "' });
        }

        const user = await firebaseService.verifyToken(idToken);
        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(`Token Validation Error: ${error.message}`);
        return res.status(401).json({ error: 'Unauthorized access' });
    }
};

module.exports = validateRequest;
