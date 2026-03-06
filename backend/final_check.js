const { MongoClient } = require('mongodb');
async function finalCheck() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const collections = await db.listCollections().toArray();
        console.log('Collection Listing:');
        for (let c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`- ${c.name} : ${count}`);
        }
    } finally {
        await client.close();
    }
}
finalCheck();
