const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function checkAllReturns() {
    await mongoose.connect(process.env.MONGODB_URI);
    const orders = await Order.find({ returnDetails: { $exists: true } });
    console.log(`Found ${orders.length} orders with returnDetails`);
    orders.forEach(o => {
        console.log(`Order: ${o.orderId}`);
        console.log(`  Reason: ${o.returnDetails.reason}`);
        console.log(`  Bill Image: ${!!o.returnDetails.billImage} (${o.returnDetails.billImage ? o.returnDetails.billImage.length : 0} chars)`);
        console.log(`  ProductImg1: ${!!o.returnDetails.productImage1} (${o.returnDetails.productImage1 ? o.returnDetails.productImage1.length : 0} chars)`);
    });
    await mongoose.disconnect();
}

checkAllReturns();
