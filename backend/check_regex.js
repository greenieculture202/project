const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenie_culture');
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        // Match what server.js does for 'Soil & Growing Media'
        // partialRegex = /Soil.*&.*Growing.*Media/i
        const regex = /Soil.*&.*Growing.*Media/i;
        
        const products = await Product.find({
            $or: [
                { category: { $regex: regex } },
                { tags: { $regex: regex } }
            ]
        }).lean();

        console.log(`TOTAL_MATCHED_IN_DB: ${products.length}`);
        products.forEach((p, idx) => {
            console.log(`- ${idx+1}. ${p.name} | Category: "${p.category}"`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
