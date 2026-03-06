const mongoose = require('mongoose');
async function listCollections() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to mejor');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
listCollections();
