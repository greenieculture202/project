const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function checkCurrentAccessories() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const products = await col.find({ category: /accessories|pots|watering|tool/i }).toArray();
        console.log(`Current DB has ${products.length} accessory-related products.`);
        console.log(products.slice(0, 5).map(p => ({ name: p.name, cat: p.cat, img: p.image })));
    } finally {
        await client.close();
    }
}

checkCurrentAccessories();
