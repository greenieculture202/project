const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
// The Cloudinary Aloe Vera image found in the dump and AboutSection
const REAL_PLACEHOLDER = 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774377646/187cd302-ed34-4dff-8708-fabc58b38f01.d1aecbe0797f49d8bdd0757c1321df94_n8pzjm.jpg';

async function setRealPlaceholder() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        // Update both Gardening and Flowering categories
        const categories = ['Gardening', 'Flowering Plants', 'Outdoor Blooms', 'Home Garden Essentials', 'Foliage & Greens', 'Decorative Style'];
        const result = await Product.updateMany(
            { category: { $in: categories } },
            { $set: { image: REAL_PLACEHOLDER } }
        );

        console.log(`\n🎉 Success! Set the Cloudinary placeholder for ${result.modifiedCount} products!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

setRealPlaceholder();
