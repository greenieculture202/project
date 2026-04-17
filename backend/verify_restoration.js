const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './backend/.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function check() {
    try {
        await mongoose.connect(uri);
        const targetNames = ['Garden Statue', 'Drip Irrigation Kit', 'Cypress', 'Mint (Pudina)', 'Neon Pothos', 'Anthurium'];
        const items = await Product.find({ name: { $in: targetNames } });
        
        console.log('--- Verification Results ---');
        items.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`- Images in Gallery: ${p.images.length}`);
            console.log(`- Main Image: ${p.image.substring(0, 80)}...`);
            console.log('---------------------------');
        });

        const totalWithGalleries = await Product.countDocuments({ 'images.0': { $exists: true } });
        console.log(`Total products with non-empty galleries: ${totalWithGalleries}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
