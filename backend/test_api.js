const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/products?category=G-INDOOR-6-SEC',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
            const products = JSON.parse(data);
            console.log(`Received ${products.length} products`);
            if (products.length > 0) {
                console.log(`First product: ${products[0].name}`);
            }
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
