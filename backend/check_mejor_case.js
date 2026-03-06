const { MongoClient } = require('mongodb');
async function checkMejorCollections() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const collections = await db.listCollections().toArray();
        console.log('Collections in mejor (Case Sensitive):');
        for (let c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`- ${c.name} | Count: ${count}`);
        }
    } finally {
        await client.close();
    }
}
checkMejorCollections();
