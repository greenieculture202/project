require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const orders = await Order.find({}).populate('userId').lean();
        let nullUserIds = 0;
        let guestCustomers = 0;
        orders.forEach(o => {
            if (!o.userId) nullUserIds++;
            if (o.userName === 'Guest Customer') guestCustomers++;
        });
        console.log(`Total Orders: ${orders.length}`);
        console.log(`Orders with null populated userId: ${nullUserIds}`);
        console.log(`Orders with userName 'Guest Customer': ${guestCustomers}`);
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
