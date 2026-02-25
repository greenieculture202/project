const mongoose = require('mongoose');

async function seedAllUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({ greenPoints: Number }, { strict: false }));
        const Order = mongoose.model('Order', new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            items: Array,
            totalAmount: Number,
            status: String,
            orderDate: Date,
            orderId: String
        }));

        const users = await User.find();
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`Seeding for user: ${user._id}`);

            // Update User points
            await User.findByIdAndUpdate(user._id, { greenPoints: 950 });

            // Add dummy orders
            const orders = [
                {
                    userId: user._id,
                    totalAmount: 1499,
                    status: 'Completed',
                    orderDate: new Date('2024-02-25'),
                    orderId: '#ORD-' + Math.floor(1000 + Math.random() * 9000),
                    items: [{ name: 'Snake Plant', price: 599, quantity: 1, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1cad?w=600' }]
                },
                {
                    userId: user._id,
                    totalAmount: 1250,
                    status: 'Processing',
                    orderDate: new Date('2024-02-20'),
                    orderId: '#ORD-' + Math.floor(1000 + Math.random() * 9000),
                    items: [{ name: 'Money Plant', price: 399, quantity: 2, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600' }]
                }
            ];

            await Order.deleteMany({ userId: user._id });
            await Order.insertMany(orders);
        }

        console.log('✅ Seeded dummy orders and points for ALL users');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding orders:', err.message);
        process.exit(1);
    }
}

seedAllUsers();
