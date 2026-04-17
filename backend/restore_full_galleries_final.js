const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function restoreFullGalleries() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // 1. Load data from the Dump (Primary source for images gallery)
        const dumpFile = './all_products_dump.json';
        let dumpMap = new Map();
        if (fs.existsSync(dumpFile)) {
            const dumpData = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));
            dumpData.forEach(p => {
                if (p.name && p.images && p.images.length > 0) {
                    dumpMap.set(p.name.toLowerCase().trim(), p.images);
                }
            });
            console.log(`Loaded ${dumpMap.size} galleries from dump.`);
        } else {
            console.warn(`Dump file ${dumpFile} not found!`);
        }

        // 2. Load data from Curated JSONs (Source for main and hover images)
        const jsonFiles = [
            './flowering_images.json',
            './indoor_outdoor_images.json',
            './seed_categories_images.json',
            './soil_category_images.json',
            './remaining_categories_images.json',
            './gardening_tools_images.json',
            './fertilizers_nutrients_images.json'
        ];

        let curatedMap = new Map();
        for (const file of jsonFiles) {
            if (fs.existsSync(file)) {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                data.forEach(item => {
                    if (item.name && item.image) {
                        const name = item.name.toLowerCase().trim();
                        if (!curatedMap.has(name)) {
                            curatedMap.set(name, {
                                main: item.image,
                                hover: item.hoverImage || item.image,
                                all: [item.image]
                            });
                        } else {
                            // Add additional images to a list of potential gallery items
                            const entry = curatedMap.get(name);
                            if (!entry.all.includes(item.image)) {
                                entry.all.push(item.image);
                            }
                        }
                    }
                });
            }
        }
        console.log(`Loaded curated data for ${curatedMap.size} unique plant names.`);

        // 3. Update products
        const products = await Product.find({});
        console.log(`Processing ${products.length} products in database...`);

        let updatedCount = 0;
        for (const p of products) {
            const name = p.name.toLowerCase().trim();
            const curated = curatedMap.get(name);
            const dumpGallery = dumpMap.get(name);

            let mainImg = p.image;
            let hoverImg = p.hoverImage;
            let gallery = p.images || [];

            // Rule 1: Always update main/hover from curated if available (high-quality Cloudinary)
            if (curated) {
                mainImg = curated.main;
                hoverImg = curated.hover;
            }

            // Rule 2: If the DUMP has a gallery, use it preferentially (restores user inserted images)
            if (dumpGallery && dumpGallery.length > 0) {
                gallery = dumpGallery;
            } else if (curated && curated.all && curated.all.length > 0) {
                // Rule 3: If no dump gallery, use all unique curated images found for this name
                // (avoiding random plants from categories)
                gallery = Array.from(new Set([mainImg, hoverImg, ...curated.all]));
            } else {
                // Rule 4: Sanitization - ensure no broken thumbnails
                gallery = Array.from(new Set([mainImg, hoverImg].filter(img => img && img !== '')));
            }

            // Cleanup any remaining random placeholders from previous bad runs
            gallery = gallery.filter(url => 
                !url.includes('placeholder') && (url.includes('cloudinary') || url.includes('unsplash'))
            );

            const result = await Product.updateOne(
                { _id: p._id },
                { 
                    $set: { 
                        image: mainImg,
                        hoverImage: hoverImg,
                        images: gallery
                    } 
                }
            );
            updatedCount += result.modifiedCount;
        }

        console.log(`\n--- FINAL SUMMARY ---`);
        console.log(`Total Products Updated: ${updatedCount}`);
        console.log(`✅ Success! All galleries restored from dump and curated sources.`);
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during restoration:', err);
        process.exit(1);
    }
}

restoreFullGalleries();
