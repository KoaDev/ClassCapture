const { db } = require('../config/firebaseConfig');

const saveTranscription = async (userId, transcriptionData) => {
    try {
        const docRef = await db.collection('transcriptions').add({
            userId,
            ...transcriptionData,
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de la transcription : ", error);
        throw error;
    }
};

const getUserTranscriptions = async (userId) => {
    try {
        const snapshot = await db.collection('transcriptions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Erreur lors de la récupération des transcriptions : ", error);
        throw error;
    }
};

module.exports = {
    saveTranscription,
    getUserTranscriptions
};
