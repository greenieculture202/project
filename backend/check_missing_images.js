const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        
        const products = await Product.find({ name: { $in: ['Snake Plant', 'Aloe Vera'] } }).lean();
        console.log(JSON.stringify(products, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
