const mongoose = require('mongoose');
require('dotenv').config();

const CODES = ['G-BOGO-6-SECTION', 'G-INDOOR-6-SEC', 'G-GARDEN-6-SEC', 'G-FLOWER-6-SEC'];

async function checkTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await mongoose.connection.collection('products')
            .find({ tags: { $in: CODES } })
            .toArray();

        console.log(`Found ${products.length} products with offer codes.`);
        products.forEach(p => console.log(`- ${p.name} (${p.tags.join(', ')})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTags();
