
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function checkRevenue() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const orders = await Order.find({ }).select('totalAmount status userName');
        console.log(`Total orders in DB: ${orders.length}`);

        let total = 0;
        let guests = 0;
        orders.forEach(o => {
            if (o.userName === 'Guest Customer') guests++;
            if (o.status !== 'Cancelled') {
                total += (Number(o.totalAmount) || 0);
            }
        });

        console.log(`- Guests: ${guests}`);
        console.log(`- Registered: ${orders.length - guests}`);
        console.log(`- Calculated Total Revenue (non-cancelled): ₹${total}`);
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

checkRevenue();
