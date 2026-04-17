const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./models/Product');

async function verify() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';
        await mongoose.connect(uri);
        
        const products = await Product.find({ 
            name: { $in: ['Begonia', 'Fiddle Leaf Fig XL', 'Peace Lily Purification'] } 
        }).lean();
        
        console.log(JSON.stringify(products, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

verify();
