const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const images = {
    'Cypress': 'https://res.cloudinary.com/dzuewhxxm/image/upload/v1774339225/what-type-of-cypress-plant-v0-2i45inli657a1_xu2eri.jpg',
    'Ferns': 'https://res.cloudinary.com/dzuewhxxm/image/upload/v1774401979/Boston-Fern-4_h7td1g.jpg',
    'Jasmine (Mogra)': 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774287145/Indoor-Jasmine-Plant_hd5a6b.webp',
    'Mint (Pudina)': 'https://res.cloudinary.com/dzuewhxxm/image/upload/v1774339657/shutterstock_1718036281_zrzwqj.jpg'
};

async function restoreFour() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        console.log('✅ Connected to MongoDB...');

        for (const [name, img] of Object.entries(images)) {
            const res = await Product.updateOne({ name }, { $set: { image: img } });
            console.log(`✅ Updated ${name}: ${res.modifiedCount}`);
        }

        console.log('\n🎉 Successfully restored the 4 gardening images!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

restoreFour();
