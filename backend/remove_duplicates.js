const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

async function removeDuplicates() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected successfully.');

        console.log('Fetching all products...');
        const allProducts = await Product.find({});
        console.log(`Found ${allProducts.length} products.`);

        const nameGroups = {};
        allProducts.forEach(product => {
            const name = product.name.toLowerCase().trim();
            if (!nameGroups[name]) {
                nameGroups[name] = [];
            }
            nameGroups[name].push(product);
        });

        let totalDuplicatesRemoved = 0;

        for (const name in nameGroups) {
            const group = nameGroups[name];
            if (group.length > 1) {
                console.log(`Duplicate found for name: "${name}" (${group.length} occurrences)`);

                // Keep the one with the most "standard" slug or just the first one
                // In this case, we'll keep the first one and delete others
                const [toKeep, ...toDelete] = group;

                console.log(`Keeping: ${toKeep.name} (ID: ${toKeep._id}, Slug: ${toKeep.slug})`);

                for (const prod of toDelete) {
                    console.log(`Deleting: ${prod.name} (ID: ${prod._id}, Slug: ${prod.slug})`);
                    await Product.findByIdAndDelete(prod._id);
                    totalDuplicatesRemoved++;
                }
            }
        }

        console.log('--- CLEANUP COMPLETE ---');
        console.log(`Total duplicate documents removed: ${totalDuplicatesRemoved}`);

        process.exit(0);
    } catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
    }
}

removeDuplicates();
