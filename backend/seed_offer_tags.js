const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function seedOfferTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const mappings = [
            { category: 'Vegetable Seeds', tag: 'G-BOGO-6-SECTION' },
            { category: 'Fruit Seeds', tag: 'G-BOGO-6-SECTION' },
            { category: 'Indoor Plants', tag: 'G-INDOOR-6-SEC' },
            { category: 'Outdoor Blooms', tag: 'G-INDOOR-6-SEC' }, // Add some blooms to indoor too for demo
            { category: 'Gardening Tools', tag: 'G-GARDEN-6-SEC' },
            { category: 'Soil & Growing Media', tag: 'G-GARDEN-6-SEC' },
            { category: 'Flower Seeds', tag: 'G-FLOWER-6-BANNER' },
            { category: 'Accessories Plants', tag: 'G-ACCESS-6-SALE' }
        ];

        console.log('📦 Updating products with offer codes...');

        for (const map of mappings) {
            const result = await Product.updateMany(
                { category: map.category },
                { $addToSet: { tags: map.tag } }
            );
            console.log(`- Added ${map.tag} to ${result.modifiedCount} products in ${map.category}`);
        }

        // Add to some "Gardening" category fallback too
        const resultFallback = await Product.updateMany(
            { category: 'Gardening' },
            { $addToSet: { tags: 'G-INDOOR-6-SEC' } }
        );
        console.log(`- Added G-INDOOR-6-SEC to ${resultFallback.modifiedCount} "Gardening" products`);

        console.log('✅ Success! Now products should show up in "Associated Cards" in the Admin Panel.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during tag seeding:', err);
        process.exit(1);
    }
}

seedOfferTags();
