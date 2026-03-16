const axios = require('axios');

async function testAI() {
    try {
        console.log('Testing AI Assistant Recommendations...');
        const response = await axios.post('http://localhost:5000/api/ai-assistant', {
            message: "Mera money plant fungus jesa lag raha hai, kya karun?"
        });
        
        console.log('Status:', response.status);
        console.log('Analysis Results:');
        console.log('Text Chunk:', response.data.text.substring(0, 100), '...');
        console.log('Recommendations:', response.data.recommendations);
        
        if (response.data.recommendations && response.data.recommendations.length > 0) {
            console.log('SUCCESS: Recommendations found!');
        } else {
            console.log('WARNING: No recommendations found in response.');
        }
    } catch (error) {
        console.error('Error testing AI:', error.message);
        if (error.response) {
            console.log('Response Error:', error.response.data);
        }
    }
}

testAI();
