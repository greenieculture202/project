const mongoose = require('mongoose');
require('dotenv').config();

async function checkTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await mongoose.connection.collection('products')
            .find({ tags: { $exists: true, $ne: [] } })
            .limit(100)
            .toArray();

        const results = products.map(p => ({
            name: p.name,
            tags: p.tags,
            category: p.category
        }));

        require('fs').writeFileSync('products_tags_debug.json', JSON.stringify(results, null, 2));
        console.log('Success: Wrote 100 products to products_tags_debug.json');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTags();
