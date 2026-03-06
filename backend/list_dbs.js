const mongoose = require('mongoose');
async function listDBs() {
    try {
        await mongoose.connect('mongodb://localhost:27017/');
        console.log('Connected to server');
        const admin = mongoose.connection.useDb('admin');
        const dbs = await admin.db.admin().listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
listDBs();
