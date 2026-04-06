const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

const ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
    hoverImage: String,
    category: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const plantFixes = JSON.parse(fs.readFileSync('e:\\major_projet\\backend\\seed_categories_images.json', 'utf8'));

async function fixImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        for (const fix of plantFixes) {
            const res = await Product.updateMany(
                { name: fix.name, category: fix.category },
                { $set: { image: fix.image, hoverImage: fix.hoverImage || '' } }
            );
            console.log(`Updated ${fix.name} (${fix.category}): matched ${res.matchedCount}, modified ${res.modifiedCount}`);
        }

        console.log('Done fixing all seed category images!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixImages();
