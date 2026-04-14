const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function checkOrder() {
    await mongoose.connect(process.env.MONGODB_URI);
    const order = await Order.findOne({ status: 'Return Requested', 'returnDetails.reason': /damaged/i }); 
    if (order) {
        console.log('Order Found:', order.orderId);
        console.log('Status:', order.status);
        console.log('Return Details:', JSON.stringify(order.returnDetails, null, 2));
        console.log('Bill Image Exists:', !!order.returnDetails?.billImage);
        if (order.returnDetails?.billImage) {
            console.log('Bill Image Preview (first 100 chars):', order.returnDetails.billImage.substring(0, 100));
        }
    } else {
        console.log('Order #ORD-4310 not found');
    }
    await mongoose.disconnect();
}

checkOrder();
