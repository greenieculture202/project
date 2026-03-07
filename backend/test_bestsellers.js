const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/products/map',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const map = JSON.parse(data);
            console.log('Bestsellers count:', map['Bestsellers'] ? map['Bestsellers'].length : 0);
            if (map['Bestsellers']) {
                console.log('Top 5 Bestsellers:');
                map['Bestsellers'].slice(0, 5).forEach((p, i) => console.log(`${i + 1}. ${p.name}`));
            }
        } catch (e) {
            console.error('JSON Error:', e.message);
        }
    });
});
req.end();
