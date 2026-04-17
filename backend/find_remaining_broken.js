const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function findRemainingBroken() {
    try {
        await mongoose.connect(uri);
        
        // Find products with Unsplash, placeholder, or generic names
        const broken = await Product.find({
            $or: [
                { image: /unsplash/ },
                { image: /placeholder/ },
                { image: /bogo-combo/ },
                { image: /assets\/images/ }
            ]
        });

        console.log(`--- Found ${broken.length} items with potentially broken images ---`);
        broken.forEach(p => {
            console.log(`[${p.category}] ${p.name}: ${p.image}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
findRemainingBroken();
