const { Storage } = require("@google-cloud/storage");
const { GOOGLE_PROJECT_ID, GOOGLE_BUCKET_NAME, GOOGLE_KEY_FILE } = require('./constants');

const storage = new Storage({
    projectId: GOOGLE_PROJECT_ID,
    keyFilename: GOOGLE_KEY_FILE,
});

const bucket = storage.bucket(GOOGLE_BUCKET_NAME);

module.exports = { bucket };
