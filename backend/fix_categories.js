require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function updateCategories() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Product.updateMany(
            { category: 'Accessories Plants' },
            { $set: { category: 'Accessories' } }
        );
        console.log(`Updated ${result.modifiedCount} products from 'Accessories Plants' to 'Accessories'`);

        const result2 = await Product.updateMany(
            { category: 'Gardening Plants' },
            { $set: { category: 'Gardening' } }
        );
        console.log(`Updated ${result2.modifiedCount} products from 'Gardening Plants' to 'Gardening'`);

        process.exit(0);
    } catch (err) {
        console.error('Update error:', err);
        process.exit(1);
    }
}

updateCategories();
