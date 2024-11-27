const { initializeApp } = require('firebase/app');
const { FIREBASE_CLIENT_KEY_FILE } = require('./constants');
const firebaseConfig = require(FIREBASE_CLIENT_KEY_FILE);

const firebaseClient = initializeApp(firebaseConfig);

module.exports = {
    firebaseClient,
};
