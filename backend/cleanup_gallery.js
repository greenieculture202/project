const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
// The Cloudinary Aloe Vera image that the user wants to remove
const PLACEHOLDER_TO_REMOVE = 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774377646/187cd302-ed34-4dff-8708-fabc58b38f01.d1aecbe0797f49d8bdd0757c1321df94_n8pzjm.jpg';

async function cleanupProductGallery() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        const categories = ['Gardening', 'Flowering Plants', 'Outdoor Blooms', 'Home Garden Essentials', 'Foliage & Greens', 'Decorative Style'];
        const products = await Product.find({ category: { $in: categories } });

        console.log(`🔍 Processing ${products.length} products...`);

        let updatedCount = 0;
        for (const product of products) {
            let changed = false;

            // 1. Remove the placeholder from the images array if it's there (especially at index 0)
            if (product.images && product.images.length > 0) {
                const originalLength = product.images.length;
                product.images = product.images.filter(img => img !== PLACEHOLDER_TO_REMOVE);
                
                if (product.images.length < originalLength) {
                    changed = true;
                    console.log(`🗑️ Removed placeholder from ${product.name} gallery.`);
                }
            }

            // 2. Set the main image to the NEW first image in the array (which used to be image 2)
            if (product.images && product.images.length > 0) {
                const newMainImage = product.images[0];
                if (product.image !== newMainImage) {
                    product.image = newMainImage;
                    changed = true;
                    console.log(`🖼️ Updated main image for ${product.name}`);
                }
            }

            if (changed) {
                await product.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 Success! Cleaned up gallery for ${updatedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

cleanupProductGallery();
