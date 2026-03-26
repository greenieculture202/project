const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenie_culture');
        const Product = mongoose.model('Product', new mongoose.Schema({}));
        
        // Find ANY product with fertilizer/nutrient/booster in tags 
        // to see if we can find the 16th one.
        const query = {
            tags: { $regex: /fertilizer|nutrient|booster/i }
        };
        const items = await Product.find(query).lean();
        
        console.log(`TOTAL_FERT_TAGGED: ${items.length}`);
        items.forEach((p, index) => {
            console.log(`${index + 1}. ${p.name} | Category: "${p.category}"`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
