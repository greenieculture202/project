const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const User = require('./backend/models/User');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        let result = '✅ Connected to DB\n';
        try {
            const user = await User.findOne({ email: 'admin@greenie.com' }).lean();
            if (user) {
                result += 'Admin user found in DB:\n';
                result += `Email: ${user.email}\n`;
                result += `Role: ${user.role}\n`;
                result += `Is Blocked: ${user.isBlocked}\n`;
            } else {
                result += 'Admin user NOT found in DB\n';
            }
        } catch (innerErr) {
            result += `Error during query: ${innerErr.message}\n`;
        }
        fs.writeFileSync('admin_check_result.txt', result);
        console.log('Done writing result');
        process.exit(0);
    })
    .catch(err => {
        fs.writeFileSync('admin_check_result.txt', `❌ Connection failed: ${err.message}`);
        process.exit(1);
    });
