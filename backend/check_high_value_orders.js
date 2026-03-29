const mongoose = require('mongoose');

async function checkHighValueOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const orderSchema = new mongoose.Schema({}, { strict: false });
        const Order = mongoose.model('Order', orderSchema);

        const allOrders = await Order.find({}).lean();
        console.log(`Total orders found: ${allOrders.length}`);

        const highValueOrders = allOrders.filter(o => (o.totalAmount || 0) > 5000);
        console.log(`Orders > 5000 found: ${highValueOrders.length}`);

        highValueOrders.forEach(o => {
            console.log(`Order ID: ${o.orderId}, Amount: ${o.totalAmount}, User: ${o.userName || (o.userId ? 'Has User ID' : 'No User ID')}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkHighValueOrders();
