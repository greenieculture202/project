const mongoose = require('mongoose');
async function findTheData() {
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
                if (count > 0) {
                    console.log(`DB: ${dbName} | Coll: ${coll.name} | Count: ${count}`);
                    if (count === 11 || coll.name.toLowerCase().includes('about')) {
                        const sample = await db.collection(coll.name).findOne();
                        console.log(`  Sample:`, sample);
                    }
                }
            }
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
findTheData();
