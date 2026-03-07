const mongoose = require('mongoose');
require('dotenv').config();

async function migrateRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const Product = require('./models/Product');

        // 1. Get all distinct categories
        const categories = await Product.distinct('category');
        console.log(`Found ${categories.length} unique categories.`);

        // 2. Map each category to a unique role number starting from 1
        const CATEGORY_ROLE_MAP = {};
        categories.forEach((cat, index) => {
            CATEGORY_ROLE_MAP[cat] = index + 1;
        });

        console.log('New Category to Role Mapping:', CATEGORY_ROLE_MAP);

        // 3. Update all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products. Starting migration...`);

        let updatedCount = 0;
        for (const product of products) {
            // Assign role based on exact category match, or 0 if somehow not found
            product.role = CATEGORY_ROLE_MAP[product.category] || 0;
            await product.save();
            updatedCount++;

            if (updatedCount % 50 === 0) {
                console.log(`Updated ${updatedCount}/${products.length} products...`);
            }
        }

        console.log(`Migration complete! Successfully updated ${updatedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateRoles();
