const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

async function verifyDuplicates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        const allProducts = await Product.find({});

        const countMap = {};
        allProducts.forEach(p => {
            const name = p.name.toLowerCase().trim();
            countMap[name] = (countMap[name] || 0) + 1;
        });

        const duplicates = Object.entries(countMap).filter(([_, count]) => count > 1);

        if (duplicates.length === 0) {
            console.log('✅ No duplicate product names found in the database.');
        } else {
            console.log('❌ Duplicates still exist:');
            duplicates.forEach(([name, count]) => {
                console.log(`- "${name}": ${count} occurrences`);
            });
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

verifyDuplicates();
