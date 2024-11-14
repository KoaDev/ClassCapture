const admin = require('../config/firebaseConfig');
const db = admin.database();

// Fonction pour créer une transcription, spécifique à l'utilisateur
const createTranscription = async (req, res) => {
    try {
        const { transcriptionText } = req.body;
        const userId = req.user.uid; // L'UID de l'utilisateur, extrait du middleware d'authentification

        // Référence pour les transcriptions de cet utilisateur
        const userTranscriptionRef = db.ref(`transcriptions/${userId}`);

        // Générer un nouvel ID pour la transcription
        const newTranscriptionRef = userTranscriptionRef.push();

        // Enregistrer la transcription
        await newTranscriptionRef.set({
            transcriptionText,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            message: 'Transcription créée avec succès',
            id: newTranscriptionRef.key,
            transcriptionText
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la transcription' });
    }
};

// Récupérer une transcription spécifique de l'utilisateur
const getTranscription = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    try {
        // Récupérer la transcription spécifique à cet utilisateur
        const snapshot = await db.ref(`transcriptions/${userId}/${id}`).once('value');
        const transcription = snapshot.val();

        if (!transcription) {
            return res.status(404).json({ error: 'Transcription non trouvée' });
        }

        res.status(200).json({
            id,
            transcriptionText: transcription.transcriptionText
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la transcription' });
    }
};

// Supprimer une transcription spécifique de l'utilisateur
const deleteTranscription = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    try {
        // Supprimer la transcription spécifique à cet utilisateur
        await db.ref(`transcriptions/${userId}/${id}`).remove();

        res.status(200).json({
            message: 'Transcription supprimée avec succès',
            id
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la transcription' });
    }
};

// Lister toutes les transcriptions de l'utilisateur
const listTranscriptions = async (req, res) => {
    const userId = req.user.uid;

    try {
        // Récupérer toutes les transcriptions de cet utilisateur
        const snapshot = await db.ref(`transcriptions/${userId}`).once('value');
        const transcriptions = snapshot.val() || {};

        const formattedTranscriptions = Object.keys(transcriptions).map(id => ({
            id,
            ...transcriptions[id]
        }));

        res.status(200).json(formattedTranscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des transcriptions' });
    }
};

module.exports = {
    createTranscription,
    getTranscription,
    deleteTranscription,
    listTranscriptions
};
