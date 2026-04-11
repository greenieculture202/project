const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function removeDuplicateImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        const categories = ['Gardening', 'Flowering Plants', 'Outdoor Blooms', 'Home Garden Essentials', 'Foliage & Greens', 'Decorative Style'];
        const products = await Product.find({ category: { $in: categories } });

        console.log(`🔍 Checking duplicates for ${products.length} products...`);

        let updatedCount = 0;
        for (const product of products) {
            if (product.images && product.images.length > 1) {
                // Remove duplicates using Set while preserving order
                const uniqueImages = [...new Set(product.images)];
                
                if (uniqueImages.length < product.images.length) {
                    product.images = uniqueImages;
                    await product.save();
                    updatedCount++;
                    console.log(`🗑️ Removed duplicates for ${product.name}`);
                }
            }
        }

        console.log(`\n🎉 Success! Cleaned up duplicates for ${updatedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

removeDuplicateImages();
