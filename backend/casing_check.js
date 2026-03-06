const { MongoClient } = require('mongodb');
async function casingCheck() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const sections = await db.collection('aboutsections').find({}).toArray();
        console.log(`CASING-CHECK-START`);
        sections.forEach(s => {
            console.log(`'${s.type}' | '${s.title}'`);
        });
        console.log(`CASING-CHECK-END`);
    } finally {
        await client.close();
    }
}
casingCheck();
