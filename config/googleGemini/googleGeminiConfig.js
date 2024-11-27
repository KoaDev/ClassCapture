const { GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_MODEL } = require('./constants');


const geminiConfig = {
    apiKey: GOOGLE_GEMINI_API_KEY,
    model: GOOGLE_GEMINI_MODEL,
};

module.exports = geminiConfig;
