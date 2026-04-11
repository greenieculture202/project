const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function setHoverImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        const categories = ['Gardening', 'Flowering Plants', 'Outdoor Blooms', 'Home Garden Essentials', 'Foliage & Greens', 'Decorative Style'];
        const products = await Product.find({ category: { $in: categories } });

        console.log(`🔍 Updating hover images for ${products.length} products...`);

        let updatedCount = 0;
        for (const product of products) {
            // Check if there's a second image in the gallery
            if (product.images && product.images.length > 1) {
                const secondImage = product.images[1];
                
                if (product.hoverImage !== secondImage) {
                    product.hoverImage = secondImage;
                    await product.save();
                    updatedCount++;
                    console.log(`🔄 Set hover image for ${product.name}`);
                }
            } else if (product.images && product.images.length === 1) {
              // If only one image, maybe use it for hover too or leave it
              console.log(`⚠️ Only 1 image for ${product.name}, skipping hover update.`);
            }
        }

        console.log(`\n🎉 Success! Set the second image as hover for ${updatedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

setHoverImages();
