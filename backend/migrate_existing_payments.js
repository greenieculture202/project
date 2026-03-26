require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Payment = require('./models/Payment');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const orders = await Order.find();
        console.log(`Found ${orders.length} orders to migrate`);

        let migratedCount = 0;
        for (const order of orders) {
            // Check if payment already exists for this order to avoid duplicates (just in case)
            const exists = await Payment.findOne({ orderId: order._id });
            if (!exists) {
                const method = (order.paymentMethod || '').toUpperCase().includes('CASH') || (order.paymentMethod || '').toUpperCase().includes('COD') ? 'COD' : 'Online';
                
                const paymentRecord = new Payment({
                    orderId: order._id,
                    orderDisplayId: order.orderId,
                    userId: order.userId,
                    userName: order.userName || (order.userId ? order.userId.fullName : 'Guest'),
                    amount: order.totalAmount,
                    method: method,
                    paymentStatus: 'Pending', // Default for now
                    transactionId: ''
                });
                await paymentRecord.save();
                migratedCount++;
            }
        }

        console.log(`Migration Complete! Migrated ${migratedCount} order payment details.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration Failed:', err);
        process.exit(1);
    }
}

migrate();
