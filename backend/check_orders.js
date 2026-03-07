const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const o = await Order.findOne({ 'items.productId': { $exists: true, $ne: null } });
    console.log(o ? 'Found order with product IDs' : 'No order has product IDs');
    if (o) console.log('Example ID:', o.items[0].productId);
    process.exit(0);
}
check();
