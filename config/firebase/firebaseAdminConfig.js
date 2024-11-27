const admin = require('firebase-admin');
const { FIREBASE_DATABASE_URL, FIREBASE_ADMIN_KEY_FILE } = require('./constants');

admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_ADMIN_KEY_FILE),
    databaseURL: FIREBASE_DATABASE_URL,
});

module.exports = {
    admin,
};
