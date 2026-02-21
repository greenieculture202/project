const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function listAllNames() {
    try {
        await mongoose.connect(MONGODB_URI);
        const products = await Product.find({}, 'name category');
        console.log(`Total Products: ${products.length}`);

        // Group by category to see distribution
        const groups = products.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {});
        console.log('Categories:', groups);

        // Find specific problematic case: Peace Lily
        const peaceLilies = products.filter(p => p.name.toLowerCase().includes('peace lily'));
        console.log('Peace Lily matches in DB:', peaceLilies);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listAllNames();
