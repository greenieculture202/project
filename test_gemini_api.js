const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        process.exit(1);
    }

    console.log('Testing Gemini with key:', apiKey.substring(0, 10) + '...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try both 2.0 and 1.5 flash
    const modelsToTest = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    
    for (const modelName of modelsToTest) {
        console.log(`\n--- Testing model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello!");
            const response = await result.response;
            console.log(`✅ ${modelName} Success:`, response.text());
        } catch (err) {
            console.error(`❌ ${modelName} Failed:`, err.message);
        }
    }
}

testGemini();
