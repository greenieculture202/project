const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Note: The Node.js SDK might not have a direct listModels on the genAI object depending on version
        // But we can try to use the underlying API or just test common ones.
        // Actually, let's try gemini-1.5-flash-latest and gemini-1.5-pro-latest
        const testModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
        for (const m of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`✅ Model ${m} is AVAILABLE`);
            } catch (e) {
                console.log(`❌ Model ${m} is NOT available: ${e.message}`);
            }
        }
    } catch (err) {
        console.error('Error listing models:', err.message);
    }
}

listModels();
