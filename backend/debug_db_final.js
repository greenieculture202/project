require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const AboutSection = require('./models/AboutSection');

async function debugDB() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected');

        const count = await AboutSection.countDocuments({});
        console.log('Total AboutSections count:', count);

        const sections = await AboutSection.find({}).lean();
        sections.forEach(s => {
            console.log(`- ID: ${s._id} | Type: ${s.type} | Title: ${s.title}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
debugDB();
