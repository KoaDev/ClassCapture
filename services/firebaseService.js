const admin = require('firebase-admin');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { firebaseClient } = require('../config/firebase/firebaseClientConfig');

const auth = getAuth(firebaseClient);

const firebaseService = {
    /**
     * Verifies a Firebase ID token.
     * @param {string} token - The Firebase ID token to verify.
     * @returns {Promise<object>} - Decoded token payload containing user information.
     * @throws {Error} - If token verification fails.
     */
    verifyToken: async (token) => {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error(`Token verification failed: ${error.message}`);
            throw new Error('Token verification failed. Please provide a valid token.');
        }
    },

    /**
     * Registers a new user in Firebase Authentication.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<object>} - The created user object and ID token.
     * @throws {Error} - If user creation fails.
     */
    signupUser: async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            return { user, idToken };
        } catch (error) {
            throw new Error(`Signup failed: ${error.message}`);
        }
    },

    /**
     * Authenticates a user with Firebase Authentication.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<object>} - The authenticated user object and ID token.
     * @throws {Error} - If login fails.
     */
    loginUser: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            return { user, idToken };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }
};

module.exports = firebaseService;
