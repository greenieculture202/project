const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function diagnose() {
    try {
        console.log('--- DB DIAGNOSIS (BACKEND CONTEXT) ---');
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);

        const gopi = await User.findOne({ fullName: /gopi/i });
        if (gopi) {
            console.log('Found user:', { 
                id: gopi._id, 
                email: gopi.email, 
                fullName: gopi.fullName,
                role: gopi.role 
            });
            
            const ordersByExactId = await Order.find({ userId: gopi._id }).lean();
            console.log(`Orders found for userId ${gopi._id}:`, ordersByExactId.length);
            
            if (ordersByExactId.length === 0) {
                console.log('No orders linked to this exact userId.');
                
                const ordersByLowerName = await Order.find({ userName: /gopi/i }).lean();
                console.log(`Potential mismatched orders (found by name "Gopi"):`, ordersByLowerName.length);
                if (ordersByLowerName.length > 0) {
                    ordersByLowerName.forEach(o => {
                        console.log('Mismatched order details:', {
                            orderId: o.orderId,
                            userIdOnOrder: o.userId,
                            userNameOnOrder: o.userName,
                            total: o.totalAmount
                        });
                    });
                }
            }
        } else {
            console.log('User "Gopi" not found in database.');
        }

        const totalOrders = await Order.countDocuments();
        console.log('Total orders in database:', totalOrders);

        if (totalOrders > 0) {
            const allOrders = await Order.find({}).lean();
            console.log('--- ALL ORDERS ---');
            allOrders.forEach(o => {
                console.log(`Order: ${o.orderId}, userId: ${o.userId}, userName: ${o.userName}`);
            });
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

diagnose();
