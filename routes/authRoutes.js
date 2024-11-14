const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Importer le middleware

// Route pour inscription (accessible sans authentification)
router.post('/signup', authController.signupUser);

// Route pour connexion (accessible sans authentification)
router.post('/login', authController.loginUser);

// Route protégée pour vérifier le token (nécessite authentification)
router.post('/verifyToken', verifyToken, authController.verifyToken);

// Route protégée pour supprimer un utilisateur (nécessite authentification)
router.delete('/deleteUser', verifyToken, authController.deleteUser);

module.exports = router;
