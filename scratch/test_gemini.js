const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './backend/.env' });

async function testGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    try {
        const result = await model.generateContent('Hi, reply with "Gemini is working!"');
        const response = await result.response;
        console.log(response.text());
    } catch (err) {
        console.error('Gemini Test Failed:', err.message);
    }
}

testGemini();
