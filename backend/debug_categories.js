const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        const categories = await Product.distinct('category');
        console.log('Categories in DB:', categories);

        const fs = require('fs');
        const results = {
            categories: categories,
            counts: {}
        };
        for (const cat of categories) {
            const count = await Product.countDocuments({ category: cat });
            results.counts[cat] = count;
        }
        fs.writeFileSync('../db_report.json', JSON.stringify(results, null, 2), 'utf8');
        console.log('Report written to db_report.json');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

debug();
