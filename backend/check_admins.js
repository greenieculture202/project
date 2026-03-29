const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function checkAdmins() {
    try {
        await mongoose.connect(MONGODB_URI);
        const admins = await User.find({ role: 'admin' }).select('email fullName createdAt').lean();
        console.log('--- ADMIN LIST ---');
        admins.forEach((a, i) => {
            console.log(`${i+1}. Email: ${a.email} | Name: ${a.fullName} | CreatedAt: ${a.createdAt}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAdmins();
