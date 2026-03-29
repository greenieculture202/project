const http = require('http');

const url = 'http://localhost:5000/api/products?category=Fertilizers%20%26%20Nutrients';
http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const products = JSON.parse(data);
        console.log(`Found ${products.length} products:`);
        products.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));
    });
});
