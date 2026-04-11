const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
const GENERIC_GARDENING_IMAGE = 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80';

async function restore() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        const products = await Product.find({ 
            $or: [
                { category: 'Gardening' },
                { category: 'Outdoor Blooms' },
                { category: 'Home Garden Essentials' },
                { category: 'Foliage & Greens' },
                { category: 'Decorative Style' }
            ]
        });

        console.log(`🔍 Found ${products.length} products to restore...`);

        let updatedCount = 0;
        for (const product of products) {
            // Set the generic image as the main one
            // And keep the unique one in the gallery (it should already be there)
            
            if (product.image !== GENERIC_GARDENING_IMAGE) {
                // If the current main image is not the generic one, 
                // move it to images[0] if it's not already there
                if (!product.images.includes(product.image)) {
                    product.images.unshift(product.image);
                }
                
                product.image = GENERIC_GARDENING_IMAGE;
                await product.save();
                updatedCount++;
                console.log(`✅ Restored placeholder for: ${product.name}`);
            }
        }

        console.log(`\n🎉 Success! Restored ${updatedCount} products to placeholder state with hover effect preserved.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

restore();
