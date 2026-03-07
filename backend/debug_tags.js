const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function checkTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const productsWithSpecificTag = await Product.find({
            $or: [
                { tags: 'G-INDOOR-6-SEC' },
                { category: 'G-INDOOR-6-SEC' }
            ]
        });

        console.log(`Products with G-INDOOR-6-SEC: ${productsWithSpecificTag.length}`);

        if (productsWithSpecificTag.length === 0) {
            console.log('No products found with this specific tag. Checking all tags in the database...');
            const allProducts = await Product.find({}).limit(10);
            allProducts.forEach(p => {
                console.log(`Product: ${p.name}, Category: ${p.category}, Tags: ${JSON.stringify(p.tags)}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTags();
