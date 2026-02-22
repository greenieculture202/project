const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        console.log('📊 Database:', mongoose.connection.name);

        const count = await Product.countDocuments();
        console.log('📦 Total Products:', count);

        if (count > 0) {
            const sampleProduct = await Product.findOne();
            console.log('\n📝 Sample Product:');
            console.log(JSON.stringify(sampleProduct, null, 2));

            const categories = await Product.distinct('category');
            console.log('\n📂 Categories found:', categories);

            for (const cat of categories) {
                const catCount = await Product.countDocuments({ category: cat });
                console.log(`   - ${cat}: ${catCount} products`);
            }
        } else {
            console.log('⚠️  No products found in database!');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
