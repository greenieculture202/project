const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function checkSlugs() {
    await mongoose.connect(MONGODB_URI);
    const products = await Product.find({ category: /Seeds/i });
    console.log(`Found ${products.length} seeds products`);

    products.slice(0, 10).forEach(p => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-');
        console.log(`Name: "${p.name}" -> Slug: "${slug}"`);
    });

    // Test a specific slug lookup logic similar to server.js
    const testSlug = 'zinnia-elegans-seeds';
    const found = products.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === testSlug);
    console.log(`Test lookup for "${testSlug}": ${found ? 'FOUND (' + found.name + ')' : 'NOT FOUND'}`);

    await mongoose.disconnect();
}

checkSlugs();
