const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function migrate() {
    try {
        console.log('--- DB MIGRATION: LINK ORDERS TO GOPI ---');
        await mongoose.connect(MONGODB_URI);

        const gopi = await User.findOne({ fullName: /gopi/i });
        if (!gopi) {
            console.error('User "Gopi" not found in database.');
            process.exit(1);
        }

        console.log(`Current User Found: ${gopi.fullName} (_id: ${gopi._id})`);

        // Update all orders that mention "gopi" as the user, regardless of their current userId
        const result = await Order.updateMany(
            { userName: /gopi/i },
            { $set: { userId: gopi._id } }
        );

        console.log(`Migration Complete! Updates made: ${result.nModified || result.modifiedCount}`);

        await mongoose.connection.close();
    } catch (err) {
        console.error('Migration Error:', err);
    }
}

migrate();
