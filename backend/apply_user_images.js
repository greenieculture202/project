const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function applyImages() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const jsonPath = './remaining_categories_images.json';
        if (!fs.existsSync(jsonPath)) {
            console.error(`File not found: ${jsonPath}`);
            process.exit(1);
        }

        const curatedImages = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Processing ${curatedImages.length} curated images...`);

        let updatedCount = 0;
        let missedCount = 0;

        for (const item of curatedImages) {
            // Flexible matching: only by Name (case-insensitive)
            const result = await Product.updateMany(
                { name: { $regex: new RegExp(`^${item.name}$`, 'i') } },
                { 
                    $set: { 
                        image: item.image, 
                        hoverImage: item.hoverImage || item.image 
                    } 
                }
            );

            if (result.modifiedCount > 0) {
                updatedCount += result.modifiedCount;
                console.log(`✅ Updated ${item.name}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
            } else if (result.matchedCount === 0) {
                missedCount++;
                // console.log(`⚠️ No match found for: ${item.name} (${item.category})`);
            }
        }

        console.log('\n--- Final Summary ---');
        console.log(`Total Products Updated: ${updatedCount}`);
        console.log(`Curated Items with No Matches: ${missedCount}`);
        console.log('✅ Applied all user-set images!');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during application:', err);
        process.exit(1);
    }
}

applyImages();
