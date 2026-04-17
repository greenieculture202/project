const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function applyImages() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const jsonFiles = [
            './seed_categories_images.json',
            './soil_category_images.json',
            './remaining_categories_images.json'
        ];

        let combinedCuration = [];
        for (const file of jsonFiles) {
            if (fs.existsSync(file)) {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                combinedCuration = combinedCuration.concat(data);
                console.log(`Loaded ${data.length} items from ${file}`);
            }
        }

        // Hardcoded fixes for ones seen broken in user screenshot
        const specificFixes = {
            'English Ivy': 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=800&q=80',
            'Dracaena': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
            'Orchid': 'https://images.unsplash.com/photo-1535242208474-9a296c0b0dd3?auto=format&fit=crop&w=800&q=80',
            'Snake Plant': 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=800&q=80',
            'Aloe Vera': 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80'
        };

        console.log(`Processing total of ${combinedCuration.length} curated items...`);

        let updatedCount = 0;

        // 1. Apply from curated JSONs
        for (const item of combinedCuration) {
            const result = await Product.updateMany(
                { name: { $regex: new RegExp(`^${item.name}$`, 'i') } },
                { 
                    $set: { 
                        image: item.image, 
                        hoverImage: item.hoverImage || item.image 
                    } 
                }
            );
            updatedCount += result.modifiedCount;
        }

        // 2. Apply specific fixes for known broken ones
        for (const [name, img] of Object.entries(specificFixes)) {
            const result = await Product.updateMany(
                { name: { $regex: new RegExp(name, 'i') } },
                { $set: { image: img, hoverImage: img } }
            );
            updatedCount += result.modifiedCount;
            console.log(`Applied specific fix for ${name}: ${result.modifiedCount} updated`);
        }

        console.log('\n--- Final Summary ---');
        console.log(`Total Products Updated/Refined: ${updatedCount}`);
        console.log('✅ Applied all curated images and specific fixes!');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

applyImages();
