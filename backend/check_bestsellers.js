const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./models/Product');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Find bestsellers from the database (either by category 'Bestsellers' or just some common ones)
        const products = await Product.find({ 
            $or: [
                { category: 'Bestsellers' },
                { name: { $in: ['Peace Lily', 'Snake Plant', 'Aloe Vera', 'Jade Plant'] } }
            ]
        }, 'name image category').lean();
        
        console.log(JSON.stringify(products, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
