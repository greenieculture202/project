const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    tags: [String]
}, { collection: 'products' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const allXL = await Product.find({
            $or: [
                { category: /XL Plants/i },
                { name: /XL/i },
                { tags: /XL/i }
            ]
        }).lean();
        
        console.log('--- XL SEARCH RESULTS ---');
        console.log('Count:', allXL.length);
        allXL.forEach(p => console.log(`- ${p.name} | Cat: ${p.category}`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
