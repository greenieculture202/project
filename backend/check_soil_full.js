const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenie_culture');
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        const q = {
            $or: [
                { category: /soil|media|amendment/i },
                { tags: /soil|media|amendment/i }
            ]
        };
        const products = await Product.find(q).lean();

        console.log(`TOTAL_FOUND_IN_DB: ${products.length}`);
        
        const byCat = {};
        products.forEach(p => {
            byCat[p.category] = (byCat[p.category] || 0) + 1;
            console.log(`- ${p.name} | Category: "${p.category}"`);
        });
        
        console.log('\nCategory Breakdown:');
        console.log(JSON.stringify(byCat, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
