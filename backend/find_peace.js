const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function findPeace() {
    await mongoose.connect(MONGODB_URI);
    const products = await Product.find({ name: /Peace/i });
    console.log('Peace related products:');
    products.forEach(p => {
        console.log(`- "${p.name}" (Category: ${p.category})`);
    });
    await mongoose.disconnect();
}

findPeace();
