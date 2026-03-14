const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');
require('./models/User'); // Register User model for population

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
    const orders = await Order.find({}).populate('userId').limit(5).lean();
    console.log(JSON.stringify(orders, null, 2));
    process.exit(0);
}
check();
