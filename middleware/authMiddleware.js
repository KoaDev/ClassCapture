const {admin} = require('../config/firebaseConfig');

const verifyToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token badly formated' });
        }

        const idToken = authorizationHeader.split('Bearer ')[1];

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error :', error);
        res.status(401).json({ error: 'Bad token or expired' });
    }
};

module.exports = verifyToken;
