const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

async function checkTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const productsWithTags = await Product.find({ tags: { $exists: true, $not: { $size: 0 } } }).select('name tags');
        console.log('Products with tags:');
        productsWithTags.forEach(p => {
            console.log(`- ${p.name}: [${p.tags.join(', ')}]`);
        });

        const allTags = await Product.distinct('tags');
        console.log('\nAll unique tags:', allTags);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTags();
