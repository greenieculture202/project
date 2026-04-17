const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./models/Product');

async function check() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';
        await mongoose.connect(uri);
        
        const products = await Product.find({}, 'name image category').lean();
        
        const brokenCloudinary = products.filter(p => p.image.includes('cloudinary') || p.image.includes('assets/images'));
        const total = products.length;
        
        console.log(`Total Products: ${total}`);
        console.log(`Potential Broken Products (Cloudinary/Local): ${brokenCloudinary.length}`);
        console.log('\nBroken Products List:');
        console.log(JSON.stringify(brokenCloudinary, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
