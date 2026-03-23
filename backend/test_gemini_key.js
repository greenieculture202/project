const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testGeminiKey() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing Key:', key ? (key.substring(0, 5) + '...') : 'MISSING');
    
    if (!key) {
        console.error('ERROR: GEMINI_API_KEY not found in .env');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log('Success! AI Response:', response.text());
    } catch (err) {
        console.error('Gemini API Error:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

testGeminiKey();
