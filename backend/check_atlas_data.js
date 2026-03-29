const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function checkAtlas() {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(uri);
        console.log('✅ Connected.');

        const AboutSection = mongoose.model('AboutSection', new mongoose.Schema({}, { strict: false }));
        const sections = await AboutSection.find({ type: 'journey' }).lean();
        
        console.log('\n--- Journey Sections ---');
        sections.forEach(s => {
            console.log(`Title: ${s.title}`);
            console.log(`Image: ${s.image}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkAtlas();
