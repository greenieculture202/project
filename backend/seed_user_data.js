const mongoose = require('mongoose');

async function seedOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({ greenPoints: Number }));
        const Order = mongoose.model('Order', new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            items: Array,
            totalAmount: Number,
            status: String,
            orderDate: Date,
            orderId: String
        }));

        const userId = '699da7c23c57eaf0c6a2a1c7';

        // Update User points
        await User.findByIdAndUpdate(userId, { greenPoints: 750 });

        // Add dummy orders
        const orders = [
            {
                userId: userId,
                totalAmount: 1299,
                status: 'Completed',
                orderDate: new Date('2024-02-24'),
                orderId: '#ORD-7742',
                items: [{ name: 'Snake Plant', price: 599, quantity: 1, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1cad?w=600' }]
            },
            {
                userId: userId,
                totalAmount: 850,
                status: 'Processing',
                orderDate: new Date('2024-02-15'),
                orderId: '#ORD-7739',
                items: [{ name: 'Money Plant', price: 399, quantity: 2, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600' }]
            },
            {
                userId: userId,
                totalAmount: 2450,
                status: 'Completed',
                orderDate: new Date('2024-01-10'),
                orderId: '#ORD-7612',
                items: [{ name: 'Areca Palm', price: 1200, quantity: 1, image: 'https://images.unsplash.com/photo-1512423924558-124e4d50937c?w=600' }]
            }
        ];

        await Order.deleteMany({ userId });
        await Order.insertMany(orders);

        console.log('✅ Seeded dummy orders and points for user 699da7c23c57eaf0c6a2a1c7');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding orders:', err.message);
        process.exit(1);
    }
}

seedOrders();
