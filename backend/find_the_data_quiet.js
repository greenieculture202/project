const mongoose = require('mongoose');
async function findTheDataQuiet() {
    try {
        await mongoose.connect('mongodb://localhost:27017/');
        const admin = mongoose.connection.useDb('admin');
        const dbs = await admin.db.admin().listDatabases();

        for (let dbData of dbs.databases) {
            const dbName = dbData.name;
            if (['admin', 'config', 'local'].includes(dbName)) continue;

            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();

            for (let coll of collections) {
                const count = await db.collection(coll.name).countDocuments();
                if (count === 11 || coll.name.toLowerCase().includes('about')) {
                    console.log(`MATCH -> DB: ${dbName} | Coll: ${coll.name} | Count: ${count}`);
                    const sample = await db.collection(coll.name).findOne();
                    if (sample) {
                        console.log(`  Sample Title: ${sample.title || sample.name || 'N/A'}`);
                    }
                }
            }
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
findTheDataQuiet();
