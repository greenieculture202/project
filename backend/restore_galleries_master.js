const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function restoreAllGalleries() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // 1. Load the primary source: all_products_dump.json
        const dumpPath = path.join(__dirname, 'all_products_dump.json');
        const dumpData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
        console.log(`📦 Loaded ${dumpData.length} products from dump.`);

        // 2. Load curated fallback sources
        const curatedFiles = [
            'flowering_images.json',
            'gardening_tools_images.json',
            'soil_category_images.json',
            'indoor_outdoor_images.json',
            'fertilizers_nutrients_images.json',
            'seed_categories_images.json',
            'remaining_categories_images.json'
        ];

        let curatedMap = new Map();
        curatedFiles.forEach(file => {
            try {
                const filePath = path.join(__dirname, file);
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    data.forEach(item => {
                        curatedMap.set(item.name.toLowerCase().trim(), item);
                    });
                }
            } catch (e) {
                console.warn(`⚠️ Error loading ${file}:`, e.message);
            }
        });
        console.log(`🖼️  Loaded curated mappings for ${curatedMap.size} unique product names.`);

        // 3. Create a map for the dump data for fast lookup
        const dumpMap = new Map();
        dumpData.forEach(p => {
            dumpMap.set(p.name.toLowerCase().trim(), p);
        });

        // 4. Iterate through ALL products in the database
        const allProducts = await Product.find({});
        console.log(`🔍 Processing ${allProducts.length} products in the database...`);

        let updatedCount = 0;
        let galleryRestoredCount = 0;
        let curatedRestoredCount = 0;

        for (const product of allProducts) {
            const nameKey = product.name.toLowerCase().trim();
            const dumpEntry = dumpMap.get(nameKey);
            const curatedEntry = curatedMap.get(nameKey);

            let updates = {};

            // CASE A: Restoration from Dump (Galleries)
            if (dumpEntry) {
                // Restore the 4-image gallery if available
                if (dumpEntry.images && dumpEntry.images.length > 0) {
                    updates.images = dumpEntry.images;
                    galleryRestoredCount++;
                }

                // Restore main images from dump if they are Cloudinary links
                if (dumpEntry.image && (dumpEntry.image.includes('cloudinary') || !product.image)) {
                    updates.image = dumpEntry.image;
                }
                if (dumpEntry.hoverImage && (dumpEntry.hoverImage.includes('cloudinary') || !product.hoverImage)) {
                    updates.hoverImage = dumpEntry.hoverImage;
                }
            }

            // CASE B: Fallback/Upgrade from Curated (High Quality)
            if (curatedEntry) {
                // If the product currently has a broken/placeholder image, or we have a curated upgrade
                if (curatedEntry.image && (!updates.image || updates.image.includes('unsplash') || updates.image.includes('placeholder'))) {
                    updates.image = curatedEntry.image;
                    curatedRestoredCount++;
                }
                if (curatedEntry.hoverImage && (!updates.hoverImage || updates.hoverImage.includes('unsplash') || updates.hoverImage.includes('placeholder'))) {
                    updates.hoverImage = curatedEntry.hoverImage || curatedEntry.image;
                }
            }

            // Special handling for broken Unsplash placeholders often seen in the screenshot
            if (product.image && product.image.includes('bogo-combo.png')) {
                if (curatedEntry && curatedEntry.image) {
                    updates.image = curatedEntry.image;
                } else if (dumpEntry && dumpEntry.image) {
                    updates.image = dumpEntry.image;
                }
            }

            // APPLY UPDATES
            if (Object.keys(updates).length > 0) {
                await Product.findByIdAndUpdate(product._id, { $set: updates });
                updatedCount++;
                // console.log(`✅ Updated: ${product.name}`);
            }
        }

        console.log('\n--- Restoration Summary ---');
        console.log(`Total Products Updated: ${updatedCount}`);
        console.log(`Galleries Restored (from Dump): ${galleryRestoredCount}`);
        console.log(`Images Refined (from Curated): ${curatedRestoredCount}`);
        console.log('✅ Restoration Complete!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error during restoration:', err);
        process.exit(1);
    }
}

restoreAllGalleries();
