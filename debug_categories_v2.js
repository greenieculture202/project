const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./backend/models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        const categories = await Product.distinct('category');
        console.log('Distinct Categories:', JSON.stringify(categories, null, 2));

        for (const cat of categories) {
            const count = await Product.countDocuments({ category: cat });
            console.log(`${cat}: ${count}`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
