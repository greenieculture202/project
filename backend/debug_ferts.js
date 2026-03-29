const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');

async function debugFertilizers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const fertilizers = await Product.find({
            $or: [
                { name: /fertilizer/i },
                { name: /booster/i },
                { name: /nutrient/i },
                { category: /fertilizer/i },
                { category: /booster/i },
                { category: /nutrient/i }
            ]
        }).lean();
        
        console.log(`Found ${fertilizers.length} potential fertilizers:`);
        fertilizers.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debugFertilizers();
