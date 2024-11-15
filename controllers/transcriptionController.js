const {admin} = require('../config/firebaseConfig');
const db = admin.database();

const createTranscription = async (req, res) => {
    try {
        const { transcriptionText } = req.body;
        const userId = req.user.uid;

        const userTranscriptionRef = db.ref(`transcriptions/${userId}`);

        const newTranscriptionRef = userTranscriptionRef.push();

        await newTranscriptionRef.set({
            transcriptionText,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            message: 'OK',
            id: newTranscriptionRef.key,
            transcriptionText
        });
    } catch (error) {
        res.status(500).json({ error: 'Error: ' });
    }
};

const getTranscription = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    try {
        const snapshot = await db.ref(`transcriptions/${userId}/${id}`).once('value');
        const transcription = snapshot.val();

        if (!transcription) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json({
            id,
            transcriptionText: transcription.transcriptionText
        });
    } catch (error) {
        res.status(500).json({ error: 'Error: ' });
    }
};

const deleteTranscription = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    try {
        await db.ref(`transcriptions/${userId}/${id}`).remove();

        res.status(200).json({
            message: 'OK',
            id
        });
    } catch (error) {
        res.status(500).json({ error: 'Error: ' });
    }
};

const listTranscriptions = async (req, res) => {
    const userId = req.user.uid;

    try {
        const snapshot = await db.ref(`transcriptions/${userId}`).once('value');
        const transcriptions = snapshot.val() || {};

        const formattedTranscriptions = Object.keys(transcriptions).map(id => ({
            id,
            ...transcriptions[id]
        }));

        res.status(200).json(formattedTranscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Error: ' });
    }
};

module.exports = {
    createTranscription,
    getTranscription,
    deleteTranscription,
    listTranscriptions
};
