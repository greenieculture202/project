// Quick test for the Gemini API key
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found (length: ' + process.env.GEMINI_API_KEY.length + ')' : 'NOT FOUND');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    console.log('Testing Gemini API...');
    const result = await model.generateContent('Say "API working" in 3 words.');
    const response = await result.response;
    console.log('SUCCESS:', response.text());
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error('Error code:', err.status || err.code);
  }
}

testGemini();
