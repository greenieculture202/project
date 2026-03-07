const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const users = await User.find({}, 'email fullName method');
        console.log('User Emails in DB:');
        users.forEach(u => console.log(`- ${u.email} (${u.fullName}) [${u.method || 'Website'}]`));
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listUsers();
