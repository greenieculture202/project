const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const XL_PLANT_IMAGE = 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80';
const INDOOR_PLANT_IMAGE = 'https://images.unsplash.com/photo-1520412099521-63bc1e951717?auto=format&fit=crop&w=800&q=80';

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');

        // Fix XL Plants images that are local assets
        const result1 = await Product.updateMany(
            { category: 'XL Plants', image: /^assets\/images/ },
            { $set: { image: XL_PLANT_IMAGE } }
        );
        console.log(`Updated ${result1.modifiedCount} XL Plants images.`);

        // Also check for broken images in other categories
        const result2 = await Product.updateMany(
            { category: 'Indoor Plants', image: /^assets\/images/ },
            { $set: { image: INDOOR_PLANT_IMAGE } }
        );
        console.log(`Updated ${result2.modifiedCount} Indoor Plants images.`);

        // Ensure Garden Toolkits category is renamed to Gardening Tools for those component fetches
        // Wait, better to just let the component fetch 'Gardening Tools' which already exists.

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

fix();
