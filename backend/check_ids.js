const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
const Product = require('./models/Product');

async function checkProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({}).select('name _id').lean();
        console.log(`Found ${products.length} products:`);

        const stats = {
            total: products.length,
            validObjectId: 0,
            invalidLength: 0,
            stringId: 0
        };

        products.forEach(p => {
            const idStr = p._id.toString();
            const isObjectId = p._id instanceof mongoose.Types.ObjectId;
            const length = idStr.length;

            console.log(`- ${p.name}`);
            console.log(`  _id: ${idStr} (len: ${length}, type: ${typeof p._id}, isObjectId: ${isObjectId})`);

            if (isObjectId && length === 24) {
                stats.validObjectId++;
            } else if (length !== 24) {
                stats.invalidLength++;
            }
            if (typeof p._id === 'string') {
                stats.stringId++;
            }
        });

        console.log('\nSummary Stats:', stats);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkProducts();
