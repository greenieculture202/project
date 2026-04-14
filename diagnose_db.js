const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const User = require('./backend/models/User');
const Order = require('./backend/models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function diagnose() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('--- DB DIAGNOSIS ---');

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
                    console.log('Mismatched order sample:', {
                        orderId: ordersByLowerName[0].orderId,
                        userIdOnOrder: ordersByLowerName[0].userId,
                        userNameOnOrder: ordersByLowerName[0].userName
                    });
                }
            }
        } else {
            console.log('User "Gopi" not found in database.');
        }

        const stats = {
            totalUsers: await User.countDocuments(),
            totalOrders: await Order.countDocuments()
        };
        console.log('Stats:', stats);

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

diagnose();
