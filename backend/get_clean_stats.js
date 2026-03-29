const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function getStats() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        
        const stats = {
            users: await db.collection('users').countDocuments(),
            orders: await db.collection('orders').countDocuments(),
            products: await db.collection('products').countDocuments(),
            reviews: await db.collection('reviews').countDocuments(),
            categories: await db.collection('categories').countDocuments(),
            faqs: await db.collection('faqs').countDocuments(),
        };

        console.log(JSON.stringify(stats, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getStats();
