const { MongoClient } = require('mongodb');
async function typeCheck() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mejor');
        const sections = await db.collection('aboutsections').find({}).toArray();
        console.log(`TYPE-CHECK-START`);
        sections.forEach(s => {
            console.log(`[${s.type}] ${s.title} | Order: ${s.order}`);
        });
        console.log(`TYPE-CHECK-END`);
    } finally {
        await client.close();
    }
}
typeCheck();
