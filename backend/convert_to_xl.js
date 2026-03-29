const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    tags: [String]
}, { collection: 'products' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateToXL() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const targetNames = [
            'Areca Palm', 
            'Spider Plant', 
            'Money Plant', 
            'Boston Fern', 
            'Snake Plant', 
            'Aloe Vera'
        ];

        for (const name of targetNames) {
            const product = await Product.findOne({ name: new RegExp(`^${name}$`, 'i') });
            if (product) {
                product.name = `${product.name} XL`;
                product.category = 'XL Plants';
                if (!product.tags.includes('XL')) {
                    product.tags.push('XL');
                }
                await product.save();
                console.log(`Updated: ${name} -> ${product.name}`);
            } else {
                console.log(`Not found: ${name}`);
            }
        }
        
        const finalCount = await Product.countDocuments({$or: [{category: /XL Plants/i}, {name: /XL/i}]});
        console.log('FINAL_XL_COUNT:' + finalCount);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateToXL();
