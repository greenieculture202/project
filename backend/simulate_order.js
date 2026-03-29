const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');

async function directSaveOrder() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const userId = '6999a6e685f58699ba4521da';
        const orderData = {
            userId: userId,
            userName: 'Nikita Tank',
            items: [
                {
                    productId: '6999ba4521da1950fae5d5b8',
                    name: 'Expensive Plant',
                    price: 6000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d'
                }
            ],
            totalAmount: 6000,
            deliveryCharge: 0,
            deliveryType: 'Standard Delivery (7 Days)',
            paymentMethod: 'UPI',
            shippingDetails: {
                fullName: 'Nikita Tank',
                email: 'tanknikita982@gmail.com',
                address: '123 Test St',
                city: 'Mumbai',
                state: 'Maharashtra',
                phone: '1234567890'
            }
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        console.log('Order saved successfully:', savedOrder.orderId);

        process.exit(0);
    } catch (err) {
        console.error('Error saving order:', err);
        process.exit(1);
    }
}

directSaveOrder();
