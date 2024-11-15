const { bucket } = require('../config/firebaseConfig');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require("../config/firebaseClient.json");

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        const userFolderPath = `${user.uid}/placeholder.txt`;
        const file = bucket.file(userFolderPath);

        await file.save(Buffer.from(''), {
            contentType: 'text/plain'
        });

        res.status(201).json({
            idToken,
            uid: user.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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

const verifyToken = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        res.status(200).json({ message: 'Token valide', uid: decodedToken.uid });
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

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
