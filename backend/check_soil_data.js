const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenie_culture');
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        const soilProducts = await Product.find({
            $or: [
                { category: { $regex: /soil/i } },
                { tags: { $regex: /soil/i } }
            ]
        }).lean();

        console.log(`Products matching 'soil' criteria: ${soilProducts.length}`);
        
        soilProducts.forEach((p, idx) => {
            console.log(`${idx + 1}. ${p.name} | Category: "${p.category}" | Tags: [${p.tags ? p.tags.join(', ') : ''}]`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
