const admin = require('../config/firebaseConfig'); // Firebase Admin SDK initialisé dans firebaseConfig.js

// Middleware pour vérifier l'authentification de l'utilisateur
const verifyToken = async (req, res, next) => {
    try {
        // Récupère le token depuis le header Authorization
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant ou mal formé' });
        }

        // Extraire le token en enlevant "Bearer "
        const idToken = authorizationHeader.split('Bearer ')[1];

        // Vérifier le token avec Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Ajouter les informations de l'utilisateur à la requête (par exemple, l'UID)
        req.user = decodedToken;
        next(); // Continuer vers la route suivante si le token est valide
    } catch (error) {
        console.error('Erreur de vérification du token :', error);
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};

module.exports = verifyToken;
