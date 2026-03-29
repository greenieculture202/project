const http = require('http');

async function checkCategory(catName) {
    return new Promise((resolve, reject) => {
        const url = `http://localhost:5000/api/products?category=${encodeURIComponent(catName)}`;
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const products = JSON.parse(data);
                    resolve(products.length);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function verifyAll() {
    const cases = [
        { name: 'Soil & Growing Media', expected: 16 },
        { name: 'Fertilizers & Nutrients', expected: 15 },
        { name: 'Gardening Tools', expected: 10 }
    ];

    console.log('--- Final Sync Verification ---');
    for (const c of cases) {
        try {
            const count = await checkCategory(c.name);
            console.log(`${c.name}: Found ${count} | Expected: ${c.expected} | ${count === c.expected ? '✅ MATCH' : '❌ MISMATCH'}`);
        } catch (e) {
            console.error(`Error checking ${c.name}:`, e.message);
        }
    }
    console.log('--- Verification Finished ---');
}

verifyAll();
