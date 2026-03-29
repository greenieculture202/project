const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');
const fs = require('fs');

async function dumpFerts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await Product.find({}).lean();
        fs.writeFileSync('all_products_dump.json', JSON.stringify(products, null, 2));
        console.log('Dumped all products to all_products_dump.json');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
dumpFerts();
