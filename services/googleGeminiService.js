const { GoogleGenerativeAI } = require('@google/generative-ai');
const geminiConfig = require('../config/googleGemini/googleGeminiConfig');

class googleGeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: geminiConfig.model });
    }

    /**
     * Generates content based on a provided prompt.
     * @param {string} prompt - The text prompt for the content generation.
     * @returns {Promise<string>} - The generated content.
     * @throws {Error} - If content generation fails.
     */
    async generateContent(prompt) {
        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(`Error generating content with Gemini: ${error.message}`);
            throw new Error('Failed to generate content with Google Gemini API');
        }
    }
}


module.exports = new googleGeminiService();
