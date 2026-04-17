const mongoose = require('mongoose');
const Product = require('../backend/models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        console.log('Category Counts:', JSON.stringify(counts, null, 2));

        const blooming = await Product.find({ category: 'Flowering Plants' }).limit(5);
        console.log('Sample Flowering Plants:', JSON.stringify(blooming.map(p => p.name), null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
