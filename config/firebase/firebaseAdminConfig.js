const admin = require('firebase-admin');
const { FIREBASE_DATABASE_URL, FIREBASE_ADMIN_KEY_FILE } = require('./constants');
const { cert } = require("firebase-admin/app");

admin.initializeApp({
    credential: cert(FIREBASE_ADMIN_KEY_FILE),
    databaseURL: FIREBASE_DATABASE_URL,
});

module.exports = {
    admin,
};
