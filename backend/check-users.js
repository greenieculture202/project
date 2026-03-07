const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);

        if (count > 0) {
            const user = await User.findOne().select('email fullName password method');
            console.log('Sample User Found:');
            console.log(`Email: ${user.email}`);
            console.log(`Full Name: ${user.fullName}`);
            console.log(`Method: ${user.method || 'Website'}`);
            console.log(`Has Password: ${!!user.password}`);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkUsers();
