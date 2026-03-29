const mongoose = require('mongoose');
require('dotenv').config({ path: 'f:/mejor_project/backend/.env' });

const uriAtlas = process.env.MONGODB_URI;
const uriLocal = 'mongodb://localhost:27017/mejor';

const AboutSectionSchema = new mongoose.Schema({
    type: String,
    title: String,
    content: String,
    image: String,
    author: String,
    order: Number
}, { collection: 'aboutsections' });

async function syncPassion() {
    for (const uri of [uriAtlas, uriLocal]) {
        try {
            console.log(`Connecting to ${uri.includes('atlas') ? 'Atlas' : 'Local'}...`);
            const conn = await mongoose.createConnection(uri).asPromise();
            const AboutSection = conn.model('AboutSection', AboutSectionSchema);
            
            const res = await AboutSection.updateOne(
                { title: 'Rooted in Passion, Growing with Purpose' },
                { $set: { image: '/images/passion_journey.png' } }
            );
            console.log(`✅ Updated ${uri.includes('atlas') ? 'Atlas' : 'Local'}:`, res);
            await conn.close();
        } catch (err) {
            console.error(`❌ Error syncing ${uri}:`, err.message);
        }
    }
    process.exit(0);
}

syncPassion();
