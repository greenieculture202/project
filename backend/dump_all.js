const { MongoClient } = require('mongodb');
async function dumpAll() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const sections = await db.collection('aboutsections').find({}).toArray();
        console.log(`JSON_DUMP_START`);
        console.log(JSON.stringify(sections, null, 2));
        console.log(`JSON_DUMP_END`);
    } finally {
        await client.close();
    }
}
dumpAll();
