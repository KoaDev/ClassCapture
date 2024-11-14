const admin = require('../config/firebaseConfig');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');

const firebaseConfig = require("../firebaseClient.json");

// Initialisation de Firebase pour le SDK client (utilisé pour l'authentification)
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Inscription d'un nouvel utilisateur
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        res.status(201).json({
            idToken,
            uid: user.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Connexion de l'utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        res.status(200).json({
            idToken,
            uid: user.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Vérification du token d'authentification
const verifyToken = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        res.status(200).json({ message: 'Token valide', uid: decodedToken.uid });
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

// Suppression de l'utilisateur
const deleteUser = async (req, res) => {
    const { uid } = req.body;

    try {
        await admin.auth().deleteUser(uid);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupUser,
    loginUser,
    verifyToken,
    deleteUser,
};
