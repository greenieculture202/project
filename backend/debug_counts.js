const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');
require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
    const allOrders = await Order.find({}).populate('userId').lean();

    console.log('Total Orders in DB:', allOrders.length);

    const guestOrders = allOrders.filter(o => {
        const name = (o.userName || o.userId?.fullName || '').trim();
        return name === 'Guest Customer' || !o.userId;
    });

    const realOrders = allOrders.filter(o => {
        const name = (o.userName || o.userId?.fullName || '').trim();
        return name !== 'Guest Customer' && o.userId;
    });

    console.log('Guest Orders:', guestOrders.length);
    console.log('Real Orders:', realOrders.length);

    const realOnline = realOrders.filter(o => !((o.paymentMethod || '').toUpperCase().includes('CASH') || (o.paymentMethod || '').toUpperCase().includes('COD'))).length;
    const realCOD = realOrders.filter(o => (o.paymentMethod || '').toUpperCase().includes('CASH') || (o.paymentMethod || '').toUpperCase().includes('COD')).length;

    console.log('Real Online:', realOnline);
    console.log('Real COD:', realCOD);

    process.exit(0);
}
check();
