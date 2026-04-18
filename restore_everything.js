const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./backend/models/Product');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function restoreEverything() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB via Mongoose');
        
        console.log('Loading dump file...');
        const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
        console.log(`Loaded ${dump.length} products from dump.`);

        let count = 0;
        let foundCount = 0;
        
        const products = await Product.find({});
        console.log(`Found ${products.length} products in database to check.`);

        for (const item of dump) {
            const dbProduct = products.find(p => p.name === item.name);
            if (dbProduct) {
                foundCount++;
                dbProduct.image = item.image;
                dbProduct.hoverImage = item.hoverImage;
                dbProduct.images = item.images || [];
                if (item.description) dbProduct.description = item.description;
                
                await dbProduct.save();
                count++;
            }
        }
        
        console.log(`------------------------------------------`);
        console.log(`? MATCHED: ${foundCount} items found in DB from dump.`);
        console.log(`✅ UPDATED: ${count} items updated with original images.`);
        console.log(`------------------------------------------`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during restoration:', err);
        process.exit(1);
    }
}

restoreEverything();
