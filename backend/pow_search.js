const { MongoClient } = require('mongodb');

async function checkEverywhere() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();

        for (let dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'config', 'local'].includes(dbName)) continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();

            for (let coll of collections) {
                const count = await db.collection(coll.name).countDocuments();
                if (count === 11) {
                    console.log(`POW! Found 11 items in DB: ${dbName} | Coll: ${coll.name}`);
                    const docs = await db.collection(coll.name).find({}).toArray();
                    docs.forEach(d => console.log(`  - [${d.type}] ${d.title}`));
                }
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
checkEverywhere();
