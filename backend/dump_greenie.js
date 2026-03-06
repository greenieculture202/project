const mongoose = require('mongoose');
async function dumpGreenie() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greenie');
        const db = mongoose.connection;
        const sections = await db.collection('aboutsections').find({}).toArray();
        console.log(`Found ${sections.length} sections in greenie.aboutsections:`);
        sections.forEach(s => {
            console.log(`ID: ${s._id} | Type: ${s.type} | Title: ${s.title} | Order: ${s.order}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
dumpGreenie();
