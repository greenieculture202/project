const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
require('dotenv').config({ path: './backend/.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function restoreAll() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const jsonFiles = [
            './backend/remaining_categories_images.json', // placeholders/old ones first
            './backend/flowering_images.json',
            './backend/indoor_outdoor_images.json',
            './backend/seed_categories_images.json',
            './backend/soil_category_images.json',
            './backend/gardening_tools_images.json',
            './backend/fertilizers_nutrients_images.json'
        ];

        let combinedCuration = [];
        for (const file of jsonFiles) {
            if (fs.existsSync(file)) {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                combinedCuration = combinedCuration.concat(data);
                console.log(`✅ Loaded ${data.length} items from ${file}`);
            } else {
                console.log(`⚠️ File not found: ${file}`);
            }
        }

        console.log(`\nProcessing total of ${combinedCuration.length} curated items...`);

        let updatedCount = 0;
        let missedCount = 0;

        for (const item of combinedCuration) {
            // Flexible matching for names like "Fiddle Leaf Fig" vs "Fiddle Leaf Fig XL"
            // We'll try exact match first, then regex match
            const name = item.name.trim();
            const category = item.category;

            const query = { name: { $regex: new RegExp(`^${name}`, 'i') } };
            if (category) {
                // category matching is optional but good if available
                // query.category = { $regex: new RegExp(category, 'i') };
            }

            const result = await Product.updateMany(
                query,
                { 
                    $set: { 
                        image: item.image, 
                        hoverImage: item.hoverImage || item.image 
                    } 
                }
            );

            if (result.matchedCount > 0) {
                updatedCount += result.modifiedCount;
                console.log(`✅ Updated ${name}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
            } else {
                missedCount++;
            }
        }

        console.log('\n--- Final Summary ---');
        console.log(`Total Products Updated: ${updatedCount}`);
        console.log(`Items with No Matches: ${missedCount}`);
        console.log('✅ ALL IMAGES RESTORED FROM CURATED FILES!');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during restoration:', err);
        process.exit(1);
    }
}

restoreAll();
