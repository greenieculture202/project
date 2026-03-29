const mongoose = require('mongoose');
require('dotenv').config();

const uriAtlas = process.env.MONGODB_URI;
const uriLocal = 'mongodb://localhost:27017/mejor';

const AboutSectionSchema = new mongoose.Schema({
    type: String,
    title: String,
    content: String,
    image: String,
    author: String,
    order: Number
});

async function syncAll() {
    for (const uri of [uriAtlas, uriLocal]) {
        try {
            console.log(`Connecting to ${uri.includes('atlas') ? 'Atlas' : 'Local'}...`);
            const conn = await mongoose.createConnection(uri).asPromise();
            const AboutSection = conn.model('AboutSection', AboutSectionSchema, 'aboutsections');
            
            const res = await AboutSection.updateOne(
                { type: 'founder' },
                { 
                    $set: { 
                        title: 'HAN, Visionary & Founder',
                        content: 'Our goal at Greenie Culture is not just to sell plants, but to help you build a sanctuary for your soul. Nature is the best therapy, and we are here to bring it right to your doorstep.',
                        image: '/images/founder_han.png',
                        author: 'HAN'
                    } 
                },
                { upsert: true }
            );
            console.log(`✅ Updated ${uri.includes('atlas') ? 'Atlas' : 'Local'}:`, res);
            await conn.close();
        } catch (err) {
            console.error(`❌ Error syncing ${uri}:`, err.message);
        }
    }
}

syncAll();
