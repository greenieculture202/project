const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./models/Product');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const products = await Product.find({ 
            name: { $in: ['Snake Plant', 'Aloe Vera'] } 
        }, 'name image category').lean();
        
        console.log(JSON.stringify(products, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
