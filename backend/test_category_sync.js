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

async function verifySync() {
    const categories = [
        { name: 'Soil & Growing Media', expectedMin: 16 },
        { name: 'Fertilizers & Nutrients', expectedMin: 15 },
        { name: 'Gardening Tools', expectedMin: 1 }
    ];

    console.log('--- Verification Started ---');

    for (const cat of categories) {
        try {
            const count = await checkCategory(cat.name);
            console.log(`Category: "${cat.name}" | Found: ${count} | Expected Min: ${cat.expectedMin}`);
            
            if (count >= cat.expectedMin) {
                console.log(`✅ Success for ${cat.name}`);
            } else {
                console.log(`❌ Failure for ${cat.name}: Count too low`);
            }
        } catch (err) {
            console.error(`❌ Error fetching ${cat.name}:`, err.message);
        }
    }
    console.log('--- Verification Finished ---');
}

verifySync();
