
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

async function testStats() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const [orderAgg, productCount, userCount, weeklyTrends, totalOrdersCount] = await Promise.all([
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: {
                            $sum: {
                                $cond: [{ $ne: ['$status', 'Cancelled'] }, '$totalAmount', 0]
                            }
                        },
                        deliveredCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
                        },
                        pendingCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                        },
                        processingCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] }
                        },
                        shippedCount: {
                            $sum: { $cond: [{ $eq: ['$status', 'Shipped'] }, 1, 0] }
                        }
                    }
                }
            ]),
            Product.countDocuments({ isActive: { $ne: false } }),
            User.countDocuments({ role: { $ne: 'admin' } }),
            Order.aggregate([
                { $match: { orderDate: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dayOfWeek: '$orderDate' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Order.countDocuments({})
        ]);

        console.log('--- DB Results ---');
        console.log('Raw Total Orders Count:', totalOrdersCount);
        console.log('Order Aggregation:', JSON.stringify(orderAgg, null, 2));
        console.log('Product Count:', productCount);
        console.log('User Count:', userCount);
        console.log('Seven Days Ago:', sevenDaysAgo);
        console.log('Weekly Trends:', JSON.stringify(weeklyTrends, null, 2));

        if (orderAgg.length > 0) {
            const stats = orderAgg[0];
            console.log('Calculated Stats:', {
                totalOrders: stats.totalOrders,
                totalRevenue: stats.totalRevenue,
                deliveredCount: stats.deliveredCount,
                pendingCount: stats.pendingCount,
                processingCount: stats.processingCount,
                shippedCount: stats.shippedCount
            });
        } else {
            console.log('Calculated Stats: No orders found in pipeline.');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

testStats();
