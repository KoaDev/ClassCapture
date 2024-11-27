const { admin } = require("../config/firebase/firebaseAdminConfig");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { firebaseClient } = require('../config/firebase/firebaseClientConfig');
const logger = require("../utils/logger");

const auth = getAuth(firebaseClient);

const firebaseService = {
    /**
     * Verifies a Firebase ID token.
     */
    verifyToken: async (token) => {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            logger.error(`Token verification failed: ${error.message}`);
            throw new Error('Token verification failed. Please provide a valid token.');
        }
    },

    /**
     * Registers a new user in Firebase Authentication.
     */
    signupUser: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            logger.info(`User signed up successfully: ${email}`);
            return { user, idToken };
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                logger.warn(`Signup failed: Email already in use: ${email}`);
                throw new Error('This email is already in use.');
            }
            logger.error(`Signup failed: ${error.message}`);
            throw new Error('Signup failed. Please try again later.');
        }
    },

    /**
     * Authenticates a user with Firebase Authentication.
     */
    loginUser: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            logger.info(`User logged in successfully: ${email}`);
            return { user, idToken };
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                logger.warn(`Login failed: User not found for email: ${email}`);
                throw new Error('User not found. Please check your email and try again.');
            }
            if (error.code === 'auth/wrong-password') {
                logger.warn(`Login failed: Invalid password for email: ${email}`);
                throw new Error('Invalid credentials. Please try again.');
            }
            logger.error(`Login failed: ${error.message}`);
            throw new Error('Login failed. Please try again later.');
        }
    },
};

module.exports = firebaseService;
