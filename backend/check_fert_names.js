const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenie_culture');
        const Product = mongoose.model('Product', new mongoose.Schema({}));
        
        // Find ALL products matching the regex in category or tags
        const query = {
            $or: [
                { category: /fertilizer|nutrient|booster/i },
                { tags: /fertilizer|nutrient|booster/i }
            ]
        };
        const items = await Product.find(query).lean();
        
        console.log(`TOTAL DETECTED: ${items.length}`);
        
        // Let's filter out Soil and Seeds categories first
        const filtered = items.filter(p => !p.category.includes('Soil') && !p.category.includes('Seeds'));
        
        console.log(`FILTERED TOTAL (No Soil/Seeds): ${filtered.length}\n`);
        filtered.forEach((p, index) => {
            console.log(`${index + 1}. ${p.name} [Category: ${p.category}]`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
