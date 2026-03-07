const mongoose = require('mongoose');
require('dotenv').config();

const SEED_DATA = [
    {
        code: 'G-BOGO-6-SECTION',
        category: 'Bestsellers',
        limit: 4
    },
    {
        code: 'G-INDOOR-6-SEC',
        category: 'Indoor Plants',
        limit: 6
    },
    {
        code: 'G-GARDEN-6-SEC',
        category: 'Gardening Tools',
        limit: 6
    },
    {
        code: 'G-FLOWER-6-SEC',
        category: 'Flowering Plants',
        limit: 6
    }
];

async function seedTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const productsCollection = mongoose.connection.collection('products');

        console.log('--- Starting Seeding ---');

        for (const item of SEED_DATA) {
            // Find products in the specified category that don't already have the tag
            const products = await productsCollection
                .find({ category: item.category, tags: { $ne: item.code } })
                .limit(item.limit)
                .toArray();

            if (products.length === 0) {
                console.log(`No products found for category: ${item.category}`);
                continue;
            }

            const ids = products.map(p => p._id);
            await productsCollection.updateMany(
                { _id: { $in: ids } },
                { $addToSet: { tags: item.code } }
            );

            console.log(`Tagged ${products.length} products with ${item.code} in category ${item.category}`);
        }

        console.log('--- Seeding Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
}

seedTags();
