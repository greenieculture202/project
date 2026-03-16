const http = require('http');

const data = JSON.stringify({
  message: "Mera money plant fungus jesa lag raha hai, kya karun?"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai-assistant',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      const parsed = JSON.parse(responseData);
      console.log('AI Response Text (Markdown):', parsed.text.substring(0, 50) + '...');
      console.log('Recommendations:', parsed.recommendations);
      
      if (parsed.recommendations && parsed.recommendations.length > 0) {
        console.log('✅ SUCCESS: Recommendations found.');
      } else {
        console.log('❌ FAILURE: No recommendations found.');
      }
    } catch (e) {
      console.log('Raw Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
