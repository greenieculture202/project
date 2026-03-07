const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function seedOfferTagsCurated() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Clear ALL existing offer tags from ALL products first to start clean
        const offerTags = [
            'G-BOGO-6-SECTION',
            'G-INDOOR-6-SEC',
            'G-GARDEN-6-SEC',
            'G-FLOWER-6-SEC',
            'G-FLOWER-6-BANNER',
            'G-ACCESS-6-SALE'
        ];

        console.log('🗑️  Removing old offer tags from all products...');
        await Product.updateMany(
            {},
            { $pull: { tags: { $in: offerTags } } }
        );

        const curatedMappings = [
            // Indoor Jungle
            {
                tag: 'G-INDOOR-6-SEC',
                names: ['Peace Lily', 'Snake Plant', 'Areca Palm', 'Rubber Plant']
            },
            // BOGO Offer
            {
                tag: 'G-BOGO-6-SECTION',
                names: ['Fiddle Leaf Fig XL', 'Rubber Plant XL', 'Monstera Deliciosa XL', 'Bird of Paradise XL']
            },
            // Garden Tools
            {
                tag: 'G-GARDEN-6-SEC',
                names: ['Professional Tool Kit', 'Bonsai Tool Set', 'Pruning Essentials', 'Master Gardener Set']
            },
            // Flowering Bonanza
            {
                tag: 'G-FLOWER-6-SEC',
                names: ['Marigold Seeds', 'Sunflower Seeds', 'Zinnia Seeds', 'Petunia Seeds']
            }
        ];

        console.log('📦 Applying curated offer tags...');

        for (const map of curatedMappings) {
            // We use regex to match names case-insensitively and allow for variations (like "Seeds" suffix)
            const result = await Product.updateMany(
                { name: { $in: map.names.map(n => new RegExp(n, 'i')) } },
                { $addToSet: { tags: map.tag } }
            );
            console.log(`- Tagged ${result.modifiedCount} products with ${map.tag}`);
        }

        console.log('✅ Success! Only the specific original products are now associated.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during curated seeding:', err);
        process.exit(1);
    }
}

seedOfferTagsCurated();
