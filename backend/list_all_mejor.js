const { MongoClient } = require('mongodb');
async function listAllMejor() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const collections = await db.listCollections().toArray();
        console.log('ALL-COLLECTIONS:', collections.map(c => c.name).join(', '));
        for (let c of collections) {
            const count = await db.collection(c.name).countDocuments();
            if (c.name.toLowerCase().includes('about')) {
                console.log(`MATCH -> ${c.name} | Count: ${count}`);
            }
        }
    } finally {
        await client.close();
    }
}
listAllMejor();
