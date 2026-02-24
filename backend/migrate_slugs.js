const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

function convertToSlug(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/\(([^)]+)\)/g, '$1')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for migration...');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check.`);

        const slugMap = new Map();

        for (const product of products) {
            let baseSlug = convertToSlug(product.name);
            let finalSlug = baseSlug;
            let counter = 1;

            // Ensure uniqueness within this migration run
            while (slugMap.has(finalSlug)) {
                finalSlug = `${baseSlug}-${counter++}`;
            }

            slugMap.set(finalSlug, true);
            product.slug = finalSlug;

            try {
                await product.save();
                console.log(`Updated: ${product.name} -> ${finalSlug}`);
            } catch (err) {
                console.error(`Failed to save ${product.name}:`, err.message);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
